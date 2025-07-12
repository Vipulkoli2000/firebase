import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, app } from "../firebaseConfig";
import { sendPasswordResetEmail, signInWithPhoneNumber, updatePassword } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const firebaseConfig = app.options;

type Stage = "choose" | "email" | "phone" | "otp" | "reset";

const Forgot = () => {
    const [stage, setStage] = React.useState<Stage>("choose");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [verificationId, setVerificationId] = React.useState<string | null>(null);
    const [otp, setOtp] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const recaptchaVerifier = React.useRef<FirebaseRecaptchaVerifierModal>(null);

    const chooseMethod = (method: "email" | "phone") => {
        setStage(method);
    };

    const handleEmailReset = async () => {
        if (!email) {
            Toast.show({ type: "error", text1: "Enter email" });
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({ type: "success", text1: "Reset email sent" });
            router.back();
        } catch (err: any) {
            Toast.show({ type: "error", text1: "Error", text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    const sendOtp = async () => {
        if (!phone.match(/^(\+\d{10,15}|\d{10})$/)) {
            Toast.show({ type: "error", text1: "Invalid phone" });
            return;
        }
        setLoading(true);
        try {
            let formatted = phone;
            if (phone.match(/^\d{10}$/)) formatted = `+91${phone}`;
            const confirmation = await signInWithPhoneNumber(auth, formatted, recaptchaVerifier.current as any);
            setVerificationId(confirmation.verificationId);
            setStage("otp");
            Toast.show({ type: "success", text1: "OTP sent" });
        } catch (err:any) {
            Toast.show({ type: "error", text1: "Error", text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!verificationId) return;
        setLoading(true);
        try {
            let formatted = phone;
            if (phone.match(/^\d{10}$/)) formatted = `+91${phone}`;
            const credential = await (await signInWithPhoneNumber(auth, formatted, recaptchaVerifier.current as any)).confirm(otp);
            if (credential.user) {
                setStage("reset");
            }
        } catch (err:any) {
            Toast.show({ type: "error", text1: "Invalid OTP", text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    const savePassword = async () => {
        if (password !== confirmPassword) {
            Toast.show({ type: "error", text1: "Passwords do not match" });
            return;
        }
        if (!auth.currentUser) {
            Toast.show({ type: "error", text1: "No user authenticated" });
            return;
        }
        setLoading(true);
        try {
            await updatePassword(auth.currentUser, password);
            Toast.show({ type: "success", text1: "Password updated" });
            router.replace("/");
        } catch (err:any) {
            Toast.show({ type: "error", text1: "Error", text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
            {stage === "choose" && (
                <>
                    <Text style={styles.title}>Reset via</Text>
                    <TouchableOpacity style={styles.button} onPress={() => chooseMethod("email")}> 
                        <Text style={styles.buttonText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => chooseMethod("phone")}> 
                        <Text style={styles.buttonText}>Mobile</Text>
                    </TouchableOpacity>
                </>
            )}
            {stage === "email" && (
                <>
                    <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input}/> 
                    {loading ? <ActivityIndicator/> : <TouchableOpacity style={styles.button} onPress={handleEmailReset}><Text style={styles.buttonText}>Send reset link</Text></TouchableOpacity>}
                </>
            )}
            {stage === "phone" && (
                <>
                    <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input}/>
                    {loading ? <ActivityIndicator/> : <TouchableOpacity style={styles.button} onPress={sendOtp}><Text style={styles.buttonText}>Send OTP</Text></TouchableOpacity>}
                </>
            )}
            {stage === "otp" && (
                <>
                    <TextInput placeholder="OTP" value={otp} onChangeText={setOtp} style={styles.input} keyboardType="number-pad"/>
                    {loading ? <ActivityIndicator/> : <TouchableOpacity style={styles.button} onPress={verifyOtp}><Text style={styles.buttonText}>Verify OTP</Text></TouchableOpacity>}
                </>
            )}
            {stage === "reset" && (
                <>
                    <TextInput placeholder="New Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input}/>
                    <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input}/>
                    {loading ? <ActivityIndicator/> : <TouchableOpacity style={styles.button} onPress={savePassword}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>}
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#E8F5E9'},
    title:{fontSize:24,fontWeight:'bold',marginBottom:20,color:'#2E7D32'},
    input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#DDD',borderRadius:8,padding:15,marginVertical:10,width:'100%'},
    button:{backgroundColor:'#4CAF50',paddingVertical:12,paddingHorizontal:25,borderRadius:8,marginVertical:5},
    buttonText:{color:'#fff',fontWeight:'bold'},
});

export default Forgot;
