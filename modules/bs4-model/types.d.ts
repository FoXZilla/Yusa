
export interface ModelOption{
    id:string;
    title?:string;
    text:string;
    options :UserOption[];
}
export interface UserOption{
    type :string;
    text :string;
    flag :any;
}