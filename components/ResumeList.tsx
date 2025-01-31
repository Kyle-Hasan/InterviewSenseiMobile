import { resume } from '@/types/resume'
import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

import ResumeDisplay from './ResumeDisplay'


interface ResumeListProps { 
    resumes: resume[],
    selectedResumeUrl:string,
    setSelectedResumeUrl:(newValue:string)=>void
  
}

export default function ResumeList({resumes,setSelectedResumeUrl,selectedResumeUrl}:ResumeListProps) {
  return (
    <View style={styles.container}>
    <FlatList style={styles.innerContainer}  data={resumes} renderItem={({item}) => {
        return <ResumeDisplay resume={item} checked={selectedResumeUrl === item.url} onCheckedChange={setSelectedResumeUrl}/>
    }}>

    </FlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight:256,
    height: "auto",
    width: "auto"
  },
  innerContainer: {
    maxHeight:256,
    height: "auto",
    padding:16,
    borderWidth:1,
    borderRadius: 8,
    borderColor: "black",
    gap: 16,
    flexDirection: "column",
    overflow: "scroll"
  }

}
)