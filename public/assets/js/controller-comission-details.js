
document.addEventListener('DOMContentLoaded', async function () {
 

    await HiddenLoader()
    
});

async function HiddenLoader(){
    const loader = document.getElementById("loader");
    loader.classList.add("d-none")
}