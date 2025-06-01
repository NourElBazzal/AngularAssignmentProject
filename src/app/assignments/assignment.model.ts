export class Assignment{
    _id?:string; // Optional, as it may not be present when creating a new assignment
    id!:number;  
    name!:string;
    dueDate!:Date;
    submitted!:boolean;
    fileUrl?: string; // Stores the uploaded file's URL
    courseId?: string;
    grade?: number;   
    feedback?: string;
}

