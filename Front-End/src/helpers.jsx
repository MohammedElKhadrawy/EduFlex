export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

export function swAlert(type,message="",data=""){
    //type (global) error 500, (error) error message, (success) success message
    if(type==="global"){
        Swal.fire({
            icon: "error",
            title: "Oops: Server error ...",
            text: "Internal server error 500",
        });
    }else if(type==="error"){
        Swal.fire({
            icon: "error",
            title: "Oops:"+message+"...",
            text: data,
        });
    }else{
        Swal.fire({
            icon: "success",
            title: "Great...",
            text: message,
        });
    }

}