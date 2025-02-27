import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

async function loadFirebaseConfig() {
    try {
        const response = await fetch('https://gist.githubusercontent.com/leonsaraqini/a2383515540c378376475e23ae97d390/raw/firebase-config.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading Firebase config:", error);
        return null;
    }
}


async function initializeFirebase() {
    const config = await loadFirebaseConfig();
    if (!config) return null; 

    try {
        const app = initializeApp(config);
        console.log("Firebase initialized successfully!");
        return getFirestore(app);
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        return null;
    }
}

async function getProjects() {
    const db = await initializeFirebase();
    if (!db) return; 

    try {
        const q = query(collection(db, "Project"), orderBy("order")); 
        const querySnapshot = await getDocs(q);
        const projectsContainer = document.getElementById("projects");

        console.log(q);

        querySnapshot.forEach((doc) => {
            const obj = doc.data();
            projectsContainer.innerHTML += `
                <li>
                    <p><a href="${obj.link}">${obj.title}</a></p>
                    <br>
                    <p>${obj.createdWith}</p>
                    <br>
                    <p class="projectDescription">${obj.description}</p>
                </li>
                <br>
                <hr>
                <br>
            `;
        });

        console.log("Projects loaded successfully!");
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

getProjects();
