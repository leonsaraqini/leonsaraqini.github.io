import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

async function loadFirebaseConfig(){
    try{
        const response = await fetch('https://gist.githubusercontent.com/leonsaraqini/a2383515540c378376475e23ae97d390/raw/firebase-config.json');

        if(!response.ok) throw new Error(`Failed to fetch config: ${response.statusText}`);

        return await response.json();

    } catch (error){
        console.error("Error loading Firebase config:", error);
    }
}

async function initializeFirebase(){
    const config = await loadFirebaseConfig();

    if(!config) return null;

    try{
        const app = initializeApp(config);

        return getFirestore(app);
    } catch (error){
        
        console.error("Error initializing Firebase:", error);

        return null;
    }
}

async function getProjects() {
    const db = await initializeFirebase();

    if(!db) return;

    try{
        const q = query(collection(db, "Project"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const projectsContainer = document.getElementById("projects");

        querySnapshot.forEach(doc => {
            const project = doc.data();

            projectsContainer.innerHTML += `
            <li>
                    <p><a href="${project.link}" id="button">${project.title}</a></p>
                    <br>
                    <p>${project.createdWith}</p>
                    <br>
                    <p class="projectDescription">${project.description}</p>
                </li>
                <br>
                <hr>
                <br>
            `
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    } finally {
       
        document.getElementById("loader").style.display = "none";
        document.getElementById("wholeWebPage").style.display = "block";
    }
}

getProjects();
