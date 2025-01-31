import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { resume } from "@/types/resume";
import ResumeList from "./ResumeList";

interface FileSelectProps {
  file: DocumentPicker.DocumentPickerAsset | null;
  setFile: (newValue: DocumentPicker.DocumentPickerAsset) => void;
  disabled: boolean;
  initialResumeUrl: string;
  initialResumeName: string;
  resumes: resume[];
  setResumes: (newValue: resume[]) => void;
  selectedResumeUrl: string;
  setSelectedResumeUrl: (newValue: string) => void;
  uploadedFileUrl: string;
  setUploadedFileUrl: (newValue: string) => void;
}

export default function FileSelect({
  file,
  setFile,
  resumes,
  setResumes,
  disabled,
  initialResumeUrl,
  initialResumeName,
  selectedResumeUrl,
  setSelectedResumeUrl,
  uploadedFileUrl,
  setUploadedFileUrl,
}: FileSelectProps) {
  const [error, setError] = useState("");

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const { uri, name } = result.assets[0];

      if (!name.endsWith(".pdf")) {
        setError("Only PDF files allowed");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        setError("File could not be accessed");
        return;
      }

      setError("");
      setFile(result.assets[0]);

      const newResume: resume = {
        fileName: name,
        url: uri,
        date: new Date().toISOString().split("T")[0],
      };

      setResumes([newResume, ...resumes]);
      setSelectedResumeUrl(uri);
      setUploadedFileUrl(uri);
    } catch (err) {
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };

  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      {resumes.length > 0 && (
        <ResumeList
          selectedResumeUrl={selectedResumeUrl}
          setSelectedResumeUrl={setSelectedResumeUrl}
          resumes={resumes}
        />
      )}

      {!disabled && (
        <TouchableOpacity
          onPress={handleFileSelect}
          style={{
            borderWidth: 2,
            borderColor: "black",
            borderStyle: "dotted",
            padding: 10,
            alignItems: "center",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text style={{ color: "gray" }}>Tap to select a PDF file</Text>
        </TouchableOpacity>
      )}

      {error.length > 0 && <Text style={{ color: "red" }}>{error}</Text>}

      {file && initialResumeName && initialResumeUrl && (
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ textDecorationLine: "underline", color: "blue" }}>
            {initialResumeName}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
