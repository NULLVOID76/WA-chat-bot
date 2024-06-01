function detect ( s ){
    s=s.toLowerCase();
    if(s.includes("college"))
        return "MMMUT Gotakhpur"
    if(s.includes("date"))
        return "2/06/2024";
}

export default detect;