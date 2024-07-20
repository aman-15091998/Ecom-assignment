"use client"
import { useEffect, useState } from "react";
import styles from "./components.module.css";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import { useAuth } from "~/context/AuthContext";
export const EmailVerify=({email}: any)=>{
    const {loginUser}=useAuth();
    const [otp, setOtp]=useState<any>({
        one:null,
        two:null,
        three:null,
        four:null,
        five:null,
        six:null,
        seven:null,
        eight:null,
    });
    const {isError, isPending, isSuccess, mutateAsync}= api.user.verifyEmail.useMutation();

    const generateOtp = api.user.generateOtp.useMutation();
    useEffect(()=>{
        const setOTPAndSend = async (email: string) => {
            try {
              await generateOtp.mutateAsync({ email });
              toast.success("OTP sent to your email");
            } catch (error) {
              toast.error("Failed to send OTP");
            }
        }; 
        setOTPAndSend(email);
    }, []);
    const otpHandler=async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const {one, two, three, four, five, six, seven, eight}=otp;
        if(one && two && three && four && five && six && seven && eight){
            let val=0;
            for(let i in otp){
                val=((val*10)+Number(otp[i]));
            }
            // console.log(val);
            try {
                let verifiedUser=await mutateAsync({
                  email,
                  otp:val
                });
                // console.log(verifiedUser);
                loginUser(verifiedUser);
               toast.success("Email verification is successful!");
              } catch (error) {
                // console.log(error);
                toast.error("Incorrect OTP!");
              }
        };
    }
    // on input going to next input
    const nextInput=(e: React.ChangeEvent<HTMLInputElement>, nextElementId: string)=> {
        if (e.target.value.length >=1) {
            e.target.value=e.target.value.substring(e.target.value.length-1);
            document.getElementById(nextElementId)?.focus();
        }
    }
    // on backspace going to previous input
    const prevInput=(e: React.KeyboardEvent<HTMLInputElement>, prevElementId:string)=>{
        const target = e.target as HTMLInputElement;
        if(target.value.length==0 && e.keyCode==8){
            document.getElementById(prevElementId)?.focus();
        }
    }
    const preventExtraDigits=(e: React.ChangeEvent<HTMLInputElement>)=>{
        e.target.value=e.target.value.substring(e.target.value.length-1);
    }
    const maskEmail=()=>{
        const arr=email.split("@");
        let emailLen=arr[0].length;
        console.log(arr);
        let masked=arr[0].substring(0, emailLen-3)+"***"+"@gmail.com";
        return masked;
    }
    return (
        <div className={styles.emailVerifyFormDiv}>
            <h1 className={styles.emailVerifyHeading}>Verify your email</h1>
            <p className={styles.infoPara}>Enter the 8 digit code you have received on 
            <br></br><span>{maskEmail()}</span></p>
            <form onSubmit={otpHandler}>
                <div className={`${styles.formElement} ${styles.extraMargin}`}>
                    <label>Code</label>
                    <div className={styles.codeInputDiv}>
                        <input type="Number" min={0} max={9} id="input1" onChange={(e)=>{setOtp({...otp, one:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input2")}} required></input>
                        <input type="Number" min={0} max={9} id="input2" onChange={(e)=>{setOtp({...otp, two:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input3")}} onKeyUpCapture={(e)=>{prevInput(e, "input1")}} required></input>
                        <input type="Number" min={0} max={9} id="input3" onChange={(e)=>{setOtp({...otp, three:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input4")}} onKeyUpCapture={(e)=>{prevInput(e, "input2")}} required></input>
                        <input type="Number" min={0} max={9} id="input4" onChange={(e)=>{setOtp({...otp, four:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input5")}} onKeyUpCapture={(e)=>{prevInput(e, "input3")}} required></input>
                        <input type="Number" min={0} max={9} id="input5" onChange={(e)=>{setOtp({...otp, five:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input6")}} onKeyUpCapture={(e)=>{prevInput(e, "input4")}} required></input>
                        <input type="Number" min={0} max={9} id="input6" onChange={(e)=>{setOtp({...otp, six:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input7")}} onKeyUpCapture={(e)=>{prevInput(e, "input5")}} required></input>
                        <input type="Number" min={0} max={9} id="input7" onChange={(e)=>{setOtp({...otp, seven:e.target.value})}} onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{nextInput(e, "input8")}} onKeyUpCapture={(e)=>{prevInput(e, "input6")}} required></input>
                        <input type="Number" min={0} max={9} id="input8" onChange={(e)=>{setOtp({...otp, eight:e.target.value})}} onInput={preventExtraDigits} onKeyUpCapture={(e)=>{prevInput(e, "input7")}}  required></input>
                    </div>
                </div>
                <button className={styles.emailVerifyBtn}>{isPending?"Verifying...":"Verify"}</button>
            </form>
        </div>
    )
}