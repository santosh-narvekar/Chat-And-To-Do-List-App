import moment from "moment";

export default function convertTime(date_input:string){
   return moment(date_input).format('llll');
}