import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Replace with your axiosInstance if needed
import FileSelect from "./FileSelect";
import Spinner from "./Spinner";
import { router } from "expo-router";
import api from "@/app/api/api";
import { resume } from "@/types/resume";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";


interface InterviewFormData {
  resume: {
    uri: string,
    name: string
    type: string
    blob ?:string
  }| null;
  resumeUrl: string | null;
  numberOfBehavioral: number;
  numberOfTechnical: number;
  jobDescription: string;
  name: string;
  secondsPerAnswer: number;
  additionalDescription: string;
}

interface InterviewFormProps {
  initialData: InterviewFormData;
  disabled: boolean; // disabled means it's a view-only form, for viewing an existing interview
  initialResumeUrl: string; // for old interviews
  initialResumeName: string; // for old interviews
  allResumes?: resume[]; // users's resumes
}

export default function InterviewForm({
  initialData,
  disabled,
  initialResumeName,
  initialResumeUrl,
  allResumes,
}: InterviewFormProps) {
  const [formData, setFormData] = useState<InterviewFormData>(initialData);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [resumes, setResumes] = useState(allResumes);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(
    allResumes && allResumes.length > 0 ? allResumes[0].url : ""
  );
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const handleSubmit = async () => {
    setErrors("");

    if (formData.numberOfBehavioral + formData.numberOfTechnical === 0) {
      setErrors("Need more than 1 question");
      return;
    }

    if (formData.name.length === 0) {
      setErrors("Interview needs a name");
      return;
    }

    if (formData.secondsPerAnswer >= 300 || formData.secondsPerAnswer < 10) {
      setErrors("Seconds per answer must be between 10 and 300");
      return;
    }

    try {
      setLoading(true);

      
      const formBody = new FormData();
      formBody.append("name", formData.name);
      formBody.append("secondsPerAnswer", formData.secondsPerAnswer.toString());
      formBody.append("numberOfBehavioral", formData.numberOfBehavioral.toString());
      formBody.append("numberOfTechnical", formData.numberOfTechnical.toString());
      formBody.append("jobDescription", formData.jobDescription);
      formBody.append("additionalDescription", formData.additionalDescription);


    
      debugger
      if (uploadedFileUrl && uploadedFileUrl === selectedResumeUrl && file) {
        const fileBase64 = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });
        // @ts-ignore

        formBody.append("resume",  {uri:file.uri, type: file.mimeType || "application/pdf", name:file.name} );
        debugger
     
      } else if (selectedResumeUrl !== "" && !file) {
      
        formBody.append("resumeUrl",selectedResumeUrl);
      }
debugger
      const response = await api.post(
        "/Interview/generateInterview",
        formBody,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const interview = response.data;
      setLoading(false);
      // @ts-ignore

      router.push(`(app)/(tabs)/interviews/${interview.id}`);
    } catch (e) {
      setErrors("Error: " + e);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <Spinner />
      ) : (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            {disabled ? "Interview Information" : "Generate Interview Questions"}
          </Text>

          <Text>Name</Text>
          <TextInput
            value={formData.name}
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            editable={!disabled}
          />

          <Text>Max seconds per answer</Text>
          <TextInput
            value={formData.secondsPerAnswer.toString()}
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) =>
              setFormData({ ...formData, secondsPerAnswer: +text })
            }
            editable={!disabled}
          />

          <Text>Number of Behavioral Questions</Text>
          <View style={styles.picker}>
          <Picker
            
            selectedValue={formData.numberOfBehavioral}
            onValueChange={(value) =>
              setFormData({ ...formData, numberOfBehavioral: +value })
            }
            enabled={!disabled}
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>
          </View>

          <Text>Number of Technical Questions</Text>
          <View style={styles.picker}>
          <Picker
            itemStyle={{color:"red"}}
            style={styles.picker}
            selectedValue={formData.numberOfTechnical}
            onValueChange={(value) =>
              setFormData({ ...formData, numberOfTechnical: +value })
            }
            enabled={!disabled}
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>
          </View>

          <Text>Job Description</Text>
          <TextInput
            value={formData.jobDescription}
            style={styles.textarea}
            onChangeText={(text) =>
              setFormData({ ...formData, jobDescription: text })
            }
            editable={!disabled}
            multiline
          />

          <Text>Additional Description</Text>
          <TextInput
            value={formData.additionalDescription}
            style={styles.textarea}
            onChangeText={(text) =>
              setFormData({ ...formData, additionalDescription: text })
            }
            editable={!disabled}
            multiline
          />

          <Text>Resume</Text>

          <FileSelect
            initialResumeName={initialResumeName}
            initialResumeUrl={initialResumeUrl}
            disabled={disabled}
            resumes={resumes ? resumes : []}
            setResumes={setResumes}
            selectedResumeUrl={selectedResumeUrl}
            setSelectedResumeUrl={setSelectedResumeUrl}
            uploadedFileUrl={uploadedFileUrl}
            setUploadedFileUrl={setUploadedFileUrl}
            file={file}
            setFile={setFile}
          />

          {errors ? (
            <Text style={{ color: "red", marginTop: 10 }}>{errors}</Text>
          ) : null}

          {!disabled && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    
    
  },
  submitButton: {
    backgroundColor: "black",

    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  }
});
