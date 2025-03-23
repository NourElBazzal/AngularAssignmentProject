export class Assignment{
    id!:number;  
    name!:string;
    dueDate!:Date;
    submitted!:boolean;
    fileUrl?: string; // Stores the uploaded file's URL
    grade?: number;   
    feedback?: string;
}

