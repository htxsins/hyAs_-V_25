"use client"; // Ensures this runs on the client side

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { fetchFromGenAI } from "@/lib/genAIClient";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Loader2 } from "lucide-react"

const timeSlots = ["9-10am", "10-11am", "11-12pm", "1-2pm", "2-3pm"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getSemester() {
    const date = new Date();
    const month = date.getMonth();
    if (month >= 6 && month <= 11) {
        return 5;
    } else {
        return 6;
    }
}

export default function TimeTablePage() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            
            // Get the uid from localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.uid) {
                console.error("No user UID found in localStorage");
                setLoading(false);
                return;
            }

            const uid = userData.uid;

            try {
                // Get the document from the "College" collection where the doc ID is the UID
                const collegeDocRef = doc(db, "College", uid);
                const collegeDocSnap = await getDoc(collegeDocRef);

                if (collegeDocSnap.exists()) {
                    const collegeData = collegeDocSnap.data();
                    if (collegeData.branches) {
                        // Convert object to an array of branch names with class divisions
                        const branchArray = Object.entries(collegeData.branches).map(
                            ([branch, count]) => {
                                const classCount = Math.ceil(count / 60);
                                return {
                                    branch,
                                    classes: Array.from({ length: classCount }, (_, i) => {
                                        const studentsInClass = i === classCount - 1 ? count - (i * 60) : 60;
                                        const batchCount = Math.ceil(studentsInClass / 20);
                                        const batches = Array.from({ length: batchCount }, (_, j) => `Batch ${j + 1} (${j === batchCount - 1 ? studentsInClass - (j * 20) : 20} students)`);
                                        return {
                                            name: `${branch}Class${i + 1} (${studentsInClass} students)`,
                                            batches
                                        };
                                    })
                                };
                            }
                        );
                        setBranches(branchArray);
                    } else {
                        setBranches([]);
                    }
                } else {
                    console.error("No matching college document found");
                    setBranches([]);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
                setBranches([]);
            }

            setLoading(false);
        };

        const fetchTeacher = async () => {
            
            // Get the uid from localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.uid) {
                console.error("No user UID found in localStorage");
                setLoading(false);
                return;
            }

            const uid = userData.uid;

            try{

                const teacherDocRef = doc(db, "Teachers", uid);
                const teacherDocSnap = await getDoc(teacherDocRef);
                console.log("Teacher Data:", teacherDocSnap.data());
                
                const teacherData = teacherDocSnap.data();
                
                // Create an array to hold the arrays
                const arraysOnly = [];
                
                for (const key in teacherData) {
                    if (Array.isArray(teacherData[key])) {
                        arraysOnly.push({ [key]: teacherData[key] });
                    }
                }
                
                setTeachers(arraysOnly);
                // console.log("Arrays in Teacher Data:", arraysOnly);

            } catch(error){
                console.error("Error fetching teacher:", error);
            }
        }

        fetchBranches();
        fetchTeacher();
    }, []);

    // const findCapableTeachers = async (allTeachers,timeTable) => {

    //     const filteredTeachers = allTeachers[selectedBranch]
    //     console.log("FILTERRED: ", filteredTeachers)

    //     try {
    //       const schema = {
    //         type: "array",
    //         properties: {
    //           teachers: { type: "array" },
    //         },
    //       };
    
    //       const prompt = `Select the best teacher among the following ${filteredTeachers} who can teach the subject well, taking into consideration the timetable ${timeTable}, where teachers should be given enough breaks and the timetable should be feasible. Modiify the given timetable and give me the same data with the professor who can take the class/lab. Just add the data of the teacher who can take the class/lab in the timetable.`;
    
    //       const response = await fetchFromGenAI(schema, prompt);
    
    //       setSelectedTeacher(response.teachers);
    //     } catch (error) {
    //       console.error("Error fetching Teachers:", error);
    //       setImpact("Failed to generate Teachers. Please try again.");
    //     }
    // };

    // function generateTimetable(subjects, labs, numBatches) {
    //     let schedule = Array.from({ length: 5 }, () => Array(5).fill("")); // 5x5 empty timetable
    //     let subjectList = subjects.map(subject => {
    //         let name = Object.keys(subject)[0];
    //         let hours = Object.values(subject)[0];
    //         return { name, hours, isLab: false };
    //     });
        
    //     let labList = labs.map(lab => {
    //         let name = Object.keys(lab)[0];
    //         let hours = Object.values(lab)[0];
    //         return { name, hours, isLab: true };
    //     });
        
    //     let availableSlots = [];
    //     for (let d = 0; d < 5; d++) {
    //         for (let t = 0; t < 5; t++) {
    //             availableSlots.push([d, t]); // Collect all available slots
    //         }
    //     }
    
    //     function shuffleArray(array) {
    //         for (let i = array.length - 1; i > 0; i--) {
    //             const j = Math.floor(Math.random() * (i + 1));
    //             [array[i], array[j]] = [array[j], array[i]];
    //         }
    //     }
    
    //     function findConsecutiveSlots(hours) {
    //         shuffleArray(availableSlots);
    //         for (let [d, t] of availableSlots) {
    //             if (t <= 5 - hours) {
    //                 let valid = true;
    //                 for (let h = 0; h < hours; h++) {
    //                     if (schedule[d][t + h] !== "") {
    //                         valid = false;
    //                         break;
    //                     }
    //                 }
    //                 if (valid) return [d, t];
    //             }
    //         }
    //         return null;
    //     }
    
    //     function assignLabs(labList) {
    //         let batchLabs = Array.from({ length: numBatches }, () => [...labList]); // Each batch gets all labs
    //         shuffleArray(labList);
    
    //         for (let labIndex = 0; labIndex < labList.length; labIndex++) {
    //             let slot = findConsecutiveSlots(labList[labIndex].hours);
    //             if (slot) {
    //                 let [day, time] = slot;
    //                 for (let i = 0; i < labList[labIndex].hours; i++) {
    //                     for (let j = 0; j < numBatches; j++) {
    //                         schedule[day][time + i] += (schedule[day][time + i] ? " | " : "") + `Batch ${j + 1}: ${batchLabs[j][labIndex].name}`;
    //                     }
    //                     availableSlots = availableSlots.filter(([d, t]) => !(d === day && t === time + i));
    //                 }
    //             }
    //         }
    //     }
    
    //     assignLabs(labList);
    //     shuffleArray(subjectList);
        
    //     while (subjectList.length > 0) {
    //         let { name, hours } = subjectList.pop();
    //         for (let i = 0; i < hours; i++) {
    //             if (availableSlots.length === 0) break;
    //             let slotIndex = Math.floor(Math.random() * availableSlots.length);
    //             let [day, time] = availableSlots.splice(slotIndex, 1)[0];
    //             schedule[day][time] = name;
    //         }
    //     }
        
    //     console.log("SCHEDULE:", schedule);
    //     setTimetable(schedule);
    // }

    const findCapableTeachers = async (allTeachers, timeTable) => {

        console.log("ALL TEACHERS:", allTeachers);
        const branchObject = allTeachers.find(obj => obj.hasOwnProperty(selectedBranch));
        const filteredTeachers = branchObject ? branchObject[selectedBranch] : [];

        console.log("FILTERED TEACHERS:", filteredTeachers);
        
        console.log("TIMETABLE:", timeTable);

        try {
            const schema = {
                type: "object",
                properties: {
                    modifiedTimeTable: {
                        type: "array",
                        items: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                },
                required: ["modifiedTimeTable"]
            };

    
            const prompt = `
            You are an expert in academic scheduling. You have a timetable structured as a 2D array, where each row represents a day's schedule, and each column represents a time slot.

            Here is the timetable: 
            ${JSON.stringify(timeTable)}

            Here is the list of available teachers for assignment: 
            ${JSON.stringify(filteredTeachers)}

            Your task is to:
            1. Assign the best available teacher for each subject in the timetable.
            2. Ensure the assignments are **feasible**, considering breaks and fair workload distribution.
            3. Format the modified timetable so that each subject appears as: **"Subject Name (Professor's Name)"**.
            4. If the subject involves multiple lab batches, assign teachers accordingly.
            5. Return the modified timetable in the **same structure**, replacing subject names with **"Subject Name (Teacher's Name)"**.

            Return only the modified timetable in JSON format under the key "modifiedTimeTable".
            `;

            
            const response = await fetchFromGenAI(schema, prompt);
            return response.modifiedTimeTable;
        } catch (error) {
            console.error("Error fetching Teachers:", error);
            return null;
        }
    };
    
    async function generateTimetable(subjects, labs, numBatches, allTeachers) {
        let schedule = Array.from({ length: 5 }, () => Array(5).fill("")); // 5x5 empty timetable
        let subjectList = subjects.map(subject => ({
            name: Object.keys(subject)[0],
            hours: Object.values(subject)[0],
            isLab: false
        }));
        let labList = labs.map(lab => ({
            name: Object.keys(lab)[0],
            hours: Object.values(lab)[0],
            isLab: true
        }));
        let availableSlots = [];
    
        for (let d = 0; d < 5; d++) {
            for (let t = 0; t < 5; t++) {
                availableSlots.push([d, t]); // Collect all available slots
            }
        }
    
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    
        function findConsecutiveSlots(hours) {
            shuffleArray(availableSlots);
            for (let [d, t] of availableSlots) {
                if (t <= 5 - hours) {
                    let valid = true;
                    for (let h = 0; h < hours; h++) {
                        if (schedule[d][t + h] !== "") {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) return [d, t];
                }
            }
            return null;
        }
    
        function assignLabs(labList) {
            let batchLabs = Array.from({ length: numBatches }, () => [...labList]); // Each batch gets all labs
            shuffleArray(labList);
    
            for (let labIndex = 0; labIndex < labList.length; labIndex++) {
                let slot = findConsecutiveSlots(labList[labIndex].hours);
                if (slot) {
                    let [day, time] = slot;
                    for (let i = 0; i < labList[labIndex].hours; i++) {
                        for (let j = 0; j < numBatches; j++) {
                            schedule[day][time + i] += (schedule[day][time + i] ? " | " : "") + `Batch ${j + 1}: ${batchLabs[j][labIndex].name}`;
                        }
                        availableSlots = availableSlots.filter(([d, t]) => !(d === day && t === time + i));
                    }
                }
            }
        }
    
        assignLabs(labList);
        shuffleArray(subjectList);
        
        while (subjectList.length > 0) {
            let { name, hours } = subjectList.pop();
            for (let i = 0; i < hours; i++) {
                if (availableSlots.length === 0) break;
                let slotIndex = Math.floor(Math.random() * availableSlots.length);
                let [day, time] = availableSlots.splice(slotIndex, 1)[0];
                schedule[day][time] = name;
            }
        }
    
        const updatedTimetable = await findCapableTeachers(allTeachers, schedule);
        if (updatedTimetable) {
            schedule = updatedTimetable;
        }
        
        console.log("FINAL SCHEDULE:", schedule);
        setTimetable(schedule);
    }
    
    
    const fetchSyllabus = async (branch) => {
        try {
            const syllabusDocRef = doc(db, "Syllabus", branch);
            const syllabusDocSnap = await getDoc(syllabusDocRef);
            if (syllabusDocSnap.exists()) {

                // console.log("Syllabus Data:", syllabusDocSnap.data());
                const semester = getSemester();
                const syllabusData = syllabusDocSnap.data();
                if (syllabusData[semester]) {
                    console.log(`Labs for semester ${semester}:`, syllabusData[semester].labs);
                    console.log("type of: ",typeof(syllabusData[semester].subjects))
                    generateTimetable(syllabusData[semester].subjects, syllabusData[semester].labs, 3, teachers);
                } else {
                    console.log(`No syllabus data found for semester ${semester}`);
                }
            } else {
                console.log("No syllabus data found for branch", branch);
            }
        } catch (error) {
            console.error("Error fetching syllabus:", error);
        }
    };

    if (selectedBranch && !selectedClass) {
        const branchData = branches.find((b) => b.branch === selectedBranch)
        return (
            
            <>
            <div>
            <div className="absolute inset-0 -z-10">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="diagonalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="diagonalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ADCA5E" stopOpacity="0.7" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A49DB4" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="white" />
                    <g>
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal1-${i}`}
                                d={`M${-300 + i * 150},0 L${700 + i * 150},1000`}
                                stroke="url(#diagonalGradient1)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal2-${i}`}
                                d={`M${-200 + i * 150},0 L${800 + i * 150},1000`}
                                stroke="url(#diagonalGradient2)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                    </g>
                    <rect width="100%" height="100%" fill="url(#overlayGradient)" />
                </svg>
            </div>
                        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8 z-20">
                                <Card className="max-w-4xl mx-auto ">
                                    <CardHeader>
                                        <CardTitle className="text-4xl font-extrabold text-purple-800 ">{selectedBranch}</CardTitle>
                                        <CardDescription>Select a class from the options below</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {["Class A", "Class B", "Class C", "Class D"].map((classItem) => (
                                                <Button
                                                    key={classItem}
                                                    variant="outline"
                                                    className="h-24 text-lg font-semibold hover:bg-purple-100 hover:text-purple-800 transition-all"
                                                    onClick={() => {
                                                        setSelectedClass({ name: classItem, batches: ["Batch 1", "Batch 2"] });
                                                        fetchSyllabus(selectedBranch);
                                                    } }
                                                >
                                                    {classItem}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setSelectedBranch(null)}
                                            className="text-purple-800 hover:text-purple-900"
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Branches
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                </div></>
                
        )
      }
    
      if (selectedClass) {
        return (
            <><div className="absolute inset-0 -z-10">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="diagonalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="diagonalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ADCA5E" stopOpacity="0.7" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A49DB4" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="white" />
                    <g>
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal1-${i}`}
                                d={`M${-300 + i * 150},0 L${700 + i * 150},1000`}
                                stroke="url(#diagonalGradient1)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal2-${i}`}
                                d={`M${-200 + i * 150},0 L${800 + i * 150},1000`}
                                stroke="url(#diagonalGradient2)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                    </g>
                    <rect width="100%" height="100%" fill="url(#overlayGradient)" />
                </svg>
            </div><div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-200 p-8 z-20">
                    <Card className="max-w-5xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-blue-800">{selectedClass.name}</CardTitle>
                            <CardDescription>Timetable and class details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedClass.batches.map((batch) => (
                                    <Badge key={batch} variant="secondary">
                                        {batch}
                                    </Badge>
                                ))}
                            </div>
                            <Tabs defaultValue="timetable" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="timetable">Timetable</TabsTrigger>
                                    <TabsTrigger value="details">Class Details</TabsTrigger>
                                </TabsList>
                                <TabsContent value="timetable">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Day</TableHead>
                                                    {timeSlots.map((slot) => (
                                                        <TableHead key={slot}>{slot}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {days.map((day, dIndex) => (
                                                    <TableRow key={day}>
                                                        <TableCell className="font-medium">{day}</TableCell>
                                                        {timeSlots.map((_, tIndex) => (
                                                            <TableCell key={tIndex}>
                                                                {timetable[dIndex]?.[tIndex] || "Free"}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </TabsContent>
                                <TabsContent value="details">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Class Information</CardTitle>
                                            <CardDescription>Additional details about {selectedClass.name}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>This is where you can add more information about the selected class.</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedClass(null)}>
                                Back to Classes
                            </Button>
                        </CardFooter>
                    </Card>
                </div></>
        )
      }
    
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 p-8 flex items-center justify-center">
          <div className="absolute inset-0 -z-10">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="diagonalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="diagonalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ADCA5E" stopOpacity="0.7" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A49DB4" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="white" />
                    <g>
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal1-${i}`}
                                d={`M${-300 + i * 150},0 L${700 + i * 150},1000`}
                                stroke="url(#diagonalGradient1)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <path
                                key={`diagonal2-${i}`}
                                d={`M${-200 + i * 150},0 L${800 + i * 150},1000`}
                                stroke="url(#diagonalGradient2)"
                                strokeWidth="120"
                                fill="none" />
                        ))}
                    </g>
                    <rect width="100%" height="100%" fill="url(#overlayGradient)" />
                </svg>
            </div>
            <div className="z-20">
                <Card className="w-full max-w-md">
                    <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center  text-emerald-800">Select a Branch</CardTitle>
                    <CardDescription className="text-center">Choose your area of study</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                    {branches.map(({ branch }) => (
                        <Button 
                        key={branch}
                        variant="outline"
                        className="h-16 text-lg bg-green-400 font-semibold bg-green-500 text-black hover:bg-black-600 transition-all"
                        onClick={() => setSelectedBranch(branch)}
                    >
                        {branch}
                    </Button>
                    ))}
                    </CardContent>
                </Card>
                </div>
        </div>
      )
    
}
