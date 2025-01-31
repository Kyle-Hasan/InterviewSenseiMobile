import { resume } from "@/types/resume";
import React from "react";
import { View, Text,TouchableOpacity, Platform,StyleSheet,  } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
interface ResumeDisplayProps {
  resume:resume
  checked: boolean;
    onCheckedChange: (url:string,checked:boolean) => void;
}

export default function ResumeDisplay({resume,checked,onCheckedChange}:ResumeDisplayProps) {

  const handleCheckedChange = (isChecked: boolean) => {
    onCheckedChange(resume.url,isChecked);
  }

  const downloadResume = async (fileUrl:string,fileName:string) => {
    //download to  file system
    const fileUri = FileSystem.documentDirectory + fileName;
    const downloadObject = FileSystem.createDownloadResumable(fileUrl, fileUri);
    try {
      const downloadRes = await downloadObject.downloadAsync();
       if (!downloadRes){
        console.log("Download failed");
        return;
       }
        const uri = downloadRes.uri;
      if (Platform.OS === "android") {
        const res = await Sharing.isAvailableAsync();
        if (res) {
          await Sharing.shareAsync(uri);
        } else {
            await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                data: uri,
                flags: 1,
              });
        }
      } else if(Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.log("Error downloading file: ", error);
    }

  }



  return (
    <View>
      <BouncyCheckbox isChecked={checked} onPress={handleCheckedChange} />
      <TouchableOpacity onPress={()=> downloadResume(resume.url,resume.fileName)}><Text>{resume.fileName}</Text></TouchableOpacity>
     </View>
  );
}