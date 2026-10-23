"use client";

import { closeModal1, switchToSignIn1, switchToSignUp1 } from '@/Script';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateResume, ResumeData } from "@/utils/generateResume";

type FormData = {
    marks10: string;
    marks12: string;
    graduationMarks: string;
    stream: string;
    experience: string;
    skill: string;
    skillType: string;
};

type UserData = {
    name: string;
    email: string;
    photo: string;
};

const ModalConsult = () => {
    const [formData, setFormData] = useState<FormData>({
        marks10: "",
        marks12: "",
        graduationMarks: "",
        stream: "",
        experience: "",
        skill: "",
        skillType: ""
    });

    const [user, setUser] = useState<UserData>({
        name: "",
        email: "",
        photo: ""
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                    { withCredentials: true }
                );

                setUser({
                    name: res.data.name || res.data.user?.name || "",
                    email: res.data.email || res.data.user?.email || "",
                    photo: res.data.photo || res.data.user?.photo || "https://cdn.com/default-photo.jpg"
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser({
                    name: "Guest User",
                    email: "guest@example.com",
                    photo: "https://cdn.com/default-photo.jpg"
                });
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            const resumeData: ResumeData = {
                name: user.name,
                email: user.email,
                photo: user.photo,
                marks10: formData.marks10,
                marks12: formData.marks12,
                graduationMarks: formData.graduationMarks,
                stream: formData.stream,
                experience: formData.experience,
                skill: formData.skill,
                skillType: formData.skillType
            };

            await generateResume(resumeData);
            alert("Resume generated and downloaded successfully!");
            closeModal1();

        } catch (error) {
            alert("Failed to generate resume. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadResume = async () => {

        setIsUpload(true);

        try {

            const form = new FormData();

            form.append("marks10", formData.marks10);
            form.append("marks12", formData.marks12);
            form.append("graduationMarks", formData.graduationMarks);
            form.append("stream", formData.stream);
            form.append("experience", formData.experience);
            form.append("skill", formData.skill);
            form.append("skillType", formData.skillType);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/consultant/apply`,
                form,
                {
                    withCredentials: true
                }
            );

            console.log(response.data);
            alert("Applied successfully!");

            closeModal1();

        } catch (error) {
            alert("Failed to apply: "+error);

        } finally {

            setIsUpload(false);

        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="modal-mask" id="modalConsult">
                <div className="modal-box">
                    <button className="m-close" onClick={closeModal1}>
                        <i className="fas fa-times"></i>
                    </button>

                   <h2>Join SoftMax as Consultant</h2>
<p>Fill in your details to apply as a SoftMax consultant</p>
                    {isLoadingUser ? (
                        <div className="loading-message">Loading user data...</div>
                    ) : (
                        <div className="user-info">
                            <p>Welcome, <strong>{user.name}</strong>!</p>
                            <p>Email: {user.email}</p>
                        </div>
                    )}

                    <div className="m-tabs">
                        <button id='tSI1' className="m-tab on" onClick={switchToSignIn1}>Create Resume</button>
                    </div>

                    <div className="m-form" id='fSI1'>
                        <input
                            name="marks10"
                            placeholder="Enter 10th Marks (e.g., 85%)"
                            value={formData.marks10}
                            onChange={handleInputChange}
                        />

                        <input
                            name="marks12"
                            placeholder="Enter 12th Marks (e.g., 78%)"
                            value={formData.marks12}
                            onChange={handleInputChange}
                        />

                        <input
                            name="graduationMarks"
                            placeholder="Enter Graduation Marks (e.g., 8.5 CGPA)"
                            value={formData.graduationMarks}
                            onChange={handleInputChange}
                        />

                        <input
                            name="stream"
                            placeholder="Enter Your Stream (e.g., Computer Science)"
                            value={formData.stream}
                            onChange={handleInputChange}
                        />

                        <input
                            name="experience"
                            placeholder="Enter Experience (e.g., 3 years at Google)"
                            value={formData.experience}
                            onChange={handleInputChange}
                        />

                        <input
                            name="skill"
                            placeholder="Enter Skills (e.g., Java, React, Python)"
                            value={formData.skill}
                            onChange={handleInputChange}
                        />

                        <input
                            name="skillType"
                            placeholder="Enter Skill Type (e.g., Programming, Design)"
                            value={formData.skillType}
                            onChange={handleInputChange}
                        />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                className="btn-msub"
                                onClick={handleGenerate}
                                disabled={isGenerating || isLoadingUser}
                                style={{ flex: 1 }}
                            >
                                {isGenerating ? "Generating..." : "Download Resume"}
                            </button>

                            <button
                                className="btn-msub"
                                onClick={handleUploadResume}
                                disabled={isUpload || isLoadingUser}
                                style={{ flex: 1 }}
                            >
                                {isUpload ? "Appling..." : "Apply Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalConsult;