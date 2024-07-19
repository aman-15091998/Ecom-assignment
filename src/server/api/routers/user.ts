import { z } from "zod";
import bcrypt from "bcrypt";
import { sendOTP } from "~/server/configs/nodemailer.config";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { faker } from "@faker-js/faker";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
        isVerified: z.boolean().optional(),
        verifyCode: z.number().optional(),
        preferences: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPass=await bcrypt.hash(input.password, salt);
      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPass,
          name: input.name,
          isVerified: input.isVerified || false,
          verifyCode: input.verifyCode || 0,
          preferences: input.preferences || [],
        },
      });
      return newUser;
    }),

  // Get a user by ID
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });
      return user;
    }),
    // Get a user by Email
  getUserByEmailPassword: publicProcedure
  .input(z.object({ email: z.string().email(), password: z.string().min(8)}))
  .query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { email: input.email},
    });
    if(user){
      try{
          const isValid=await bcrypt.compare(input.password, user.password);
          if(isValid) return user;
          else return null;
      }catch(err){
        return null;
      }
    }else
      return null;
  }),
  
  verifyEmail: publicProcedure
  .input(z.object({email: z.string().email(), otp:z.number()}))
  .mutation(async ({ctx, input})=>{
    const updatedUser = await ctx.db.user.update({
      where: { email: input.email, verifyCode: input.otp },
      data: {
        isVerified: true,
      },
    });
    return updatedUser;
  }),
  
  updateUserPreferences: publicProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        preferences: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { email: input.email },
        data: {
          preferences: input.preferences,
        },
      });
      return updatedUser;
    }),

    generateOtp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // Generate a random 8-digit OTP
      const otp = Math.floor(10000000 + Math.random() * 90000000);
      // Update the user's row with the new OTP
      const updatedUser = await ctx.db.user.update({
        where: { email: input.email },
        data: { verifyCode: otp },
      });
      sendOTP(input.email, otp);
      return { success: true}; 
    }),
});
export const categoryRouter= createTRPCRouter({
  getCategories: publicProcedure.input(z.object({page:z.number()})).query(async ({ctx, input})=>{
      const count = await ctx.db.category.count();
      if(count==0){
        const categoryArr: string[]=[];
        let i=0;
        while(i++<100){
          const c=faker.commerce.productName();
          if(!categoryArr.includes(c))
            categoryArr.push(c);
        }
        const dataToInsert = categoryArr.map(name => ({
          name 
        }));
    
        const createdCategories = await ctx.db.category.createMany({
          data: dataToInsert,
        });
      }
      const categories=await ctx.db.category.findMany();
      return categories.splice(((input.page-1)*6), 6);
    })
})
