// Types
export type PromptAnswer = {
    promptId: string;
    question: string;
    answer: string;
};

export type PatientDetails = {
    name: string;
    about: string;
    age: string;
    gender: string;
    dateOfBirth: string;
    location: string;
    profilePicture: string;
    education: string;
    work: string;
    likes: string;
    dislikes: string;
    symptoms: string;
    fallRisk: string;
    passcode: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    promptAnswers: PromptAnswer[];
};

export type PromptTemplate = {
    id: string;
    question: string;
    orderNumber: number;
};