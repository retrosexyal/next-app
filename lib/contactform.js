export const sendContactForm = async (data)=>{
    fetch("/api/hello",{
        method: "POST",
        body: JSON.stringify(data)
    })
}