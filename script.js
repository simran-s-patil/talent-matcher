// script.js (Frontend - Communicates with Backend API)

const API_BASE_URL = 'http://localhost:3000/api'; // MUST MATCH THE port in server.js

let extractedSkills = [];
let jobContext = [];
let rankedCandidatesList = [];

// Removed: The hardcoded candidateDatabase is now in server.js
// Removed: The extractSkills and extractContext functions are now in server.js
// Removed: The rankCandidates function is now in server.js


async function analyzeJob() {
    const jobDesc = document.getElementById('jobDescription').value;
    
    if (!jobDesc.trim()) {
        alert('Please paste a job description first!');
        return;
    }

    showLoading("AI is extracting skills...");
    
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription: jobDesc })
        });

        const data = await response.json();
        
        if (data.success) {
            extractedSkills = data.extractedSkills;
            jobContext = data.jobContext;
            
            displayAnalysis();
        } else {
            throw new Error('Analysis failed on the server.');
        }

    } catch (error) {
        console.error("Error analyzing job (Check if server.js is running):", error);
        alert('Failed to connect to the backend API. Please ensure you are running "node server.js" in your terminal.');
    } finally {
        hideLoading();
    }
}


function displayAnalysis() {
    const skillsDiv = document.getElementById('skillsExtracted');
    
    let html = '<div><h3>🎯 Key Technical Skills:</h3>';
    extractedSkills.forEach(skill => {
        html += `<span class="skill-tag">${skill}</span>`;
    });
    
    html += '</div><div style="margin-top: 30px;"><h3>📋 Context & Culture Requirements:</h3>';
    jobContext.forEach(ctx => {
        html += `<span class="skill-tag" style="background: #e7f3ff; color: #764ba2; border-color: #764ba2;">${ctx}</span>`;
    });
    html += '</div>';
    
    skillsDiv.innerHTML = html;
    document.getElementById('analysisResult').classList.remove('hidden');
}

async function findCandidates() {
    showLoading("Searching database and calculating compatibility scores...");

    try {
        const response = await fetch(`${API_BASE_URL}/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobDescription: document.getElementById('jobDescription').value,
                extractedSkills: extractedSkills,
                jobContext: jobContext
            })
        });

        const data = await response.json();

        if (data.success) {
            rankedCandidatesList = data.candidates; // Get the ranked list from the server
            displayCandidates(rankedCandidatesList);
        } else {
            throw new Error('Candidate matching failed on the server.');
        }
        
    } catch (error) {
        console.error("Error finding candidates (Check if server.js is running):", error);
        alert('Failed to retrieve matched candidates from the server. Please ensure you are running "node server.js".');
    } finally {
        hideLoading();
    }
}

function displayCandidates(candidates) {
    const listDiv = document.getElementById('candidatesList');
    
    let html = '';
    candidates.forEach((candidate, index) => {
        if (candidate.score > 0) {
            html += `
                <div class="candidate-card" onclick="showProfile(${index})" role="button" tabindex="0" aria-label="View ${candidate.name}'s profile, score: ${candidate.score} percent match">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3>${index + 1}. ${candidate.name}</h3>
                            <p style="color: #666; margin-bottom: 5px; font-size: 16px;">${candidate.title}</p>
                            <span class="match-score" style="background-color: ${candidate.score >= 80 ? '#0a66c2' : candidate.score >= 60 ? '#4CAF50' : '#FFC107'};">${candidate.score}% Match</span>
                        </div>
                        <div style="text-align: right;">
                            <p style="color: #666; font-weight: 500;">${candidate.experience}</p>
                            <p style="color: #999; font-size: 14px; margin-top: 3px;">${candidate.location}</p>
                        </div>
                    </div>
                    <p style="margin-top: 15px; color: #444; font-size: 15px; line-height: 1.5;">${candidate.summary}</p>
                    <div class="candidate-skills">
                        <strong>Top Skills Matched: </strong>
                        ${candidate.matchedSkills.slice(0, 4).map(skill => 
                            `<span class="skill-tag" style="background: #d7eaff; color: #0a66c2; border-color: #0a66c2;">${skill}</span>`
                        ).join('')}
                        ${candidate.matchedSkills.length > 4 ? `+${candidate.matchedSkills.length - 4} more` : ''}
                    </div>
                    <p class="view-profile-link" style="margin-top: 15px;">
                        👁️ View Full AI Profile & Evaluation
                    </p>
                </div>
            `;
        }
    });
    
    listDiv.innerHTML = html;
    document.getElementById('candidatesSection').classList.remove('hidden');
    document.getElementById('candidatesSection').scrollIntoView({ behavior: 'smooth' });
}

function showProfile(index) {
    const candidate = rankedCandidatesList[index];
    
    const modal = document.getElementById('profileModal');
    const modalContent = document.getElementById('profileContent');
    
    const breakdown = candidate.scoreBreakdown;
    
    const totalPossibleBreakdown = 90; 
    const normalize = (val) => Math.min(Math.round((val / totalPossibleBreakdown) * 100), 100);
    
    modalContent.innerHTML = `
        <div class="profile-header">
            <div>
                <h2>${candidate.name}</h2>
                <p style="color: #e7f3ff; font-size: 18px; margin-top: 5px;">${candidate.title}</p>
                <p style="color: #e7f3ff; margin-top: 5px;">📍 ${candidate.location} | ⏱️ ${candidate.availability}</p>
            </div>
            <div class="overall-score">
                <div>${candidate.score}%</div>
                <div style="font-weight: 500;">Overall Match</div>
            </div>
        </div>

        <div class="profile-section">
            <h3>🎯 AI Evaluation Breakdown</h3>
            <div class="score-breakdown">
                <div class="score-item">
                    <div class="score-bar-container">
                        <div class="score-bar" style="width: ${normalize(breakdown.skillMatch)}%"></div>
                    </div>
                    <div class="score-label">
                        <span>Technical Skills Match (Max 50)</span>
                        <strong>${breakdown.skillMatch} Pts</strong>
                    </div>
                </div>
                <div class="score-item">
                    <div class="score-bar-container">
                        <div class="score-bar" style="width: ${normalize(breakdown.experienceMatch)}%; background: linear-gradient(90deg, #FF9800 0%, #F57C00 100%);"></div>
                    </div>
                    <div class="score-label">
                        <span>Experience Level (Max 20)</span>
                        <strong>${breakdown.experienceMatch} Pts</strong>
                    </div>
                </div>
                <div class="score-item">
                    <div class="score-bar-container">
                        <div class="score-bar" style="width: ${normalize(breakdown.contextMatch)}%; background: linear-gradient(90deg, #00BCD4 0%, #00838F 100%);"></div>
                    </div>
                    <div class="score-label">
                        <span>Cultural & Context Fit (Max 10)</span>
                        <strong>${breakdown.contextMatch} Pts</strong>
                    </div>
                </div>
                <div class="score-item">
                    <div class="score-bar-container">
                        <div class="score-bar" style="width: ${normalize(breakdown.projectRelevance)}%; background: linear-gradient(90deg, #4CAF50 0%, #388E3C 100%);"></div>
                    </div>
                    <div class="score-label">
                        <span>Project & Certification Relevance (Max 10)</span>
                        <strong>${breakdown.projectRelevance} Pts</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="recommendation-box profile-section">
            <h3>💡 AI Recommendation</h3>
            <p style="font-weight: 600; margin-bottom: 10px; color: #333;">Why ${candidate.name} is a top match:</p>
            <p>${generateRecommendation(candidate)}</p>
        </div>

        <div class="profile-section">
            <h3>💼 Professional Summary</h3>
            <p>${candidate.summary}</p>
        </div>

        <div class="profile-section">
            <h3>🛠️ Technical Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${candidate.skills.map(skill => {
                    const isMatched = candidate.matchedSkills.includes(skill);
                    return `<span class="skill-tag" style="background: ${isMatched ? '#d7eaff' : '#f3f2ef'}; color: ${isMatched ? '#0a66c2' : '#666'}; border-color: ${isMatched ? '#0a66c2' : '#e8e8e8'};">
                        ${skill} ${isMatched ? '✓' : ''}
                    </span>`;
                }).join('')}
            </div>
        </div>

        <div class="profile-section">
            <h3>🚀 Key Projects & Accomplishments</h3>
            <ul class="projects-list">
                ${candidate.projects.map(project => `<li>${project}</li>`).join('')}
            </ul>
        </div>
        
        <div class="profile-grid">
            <div class="profile-section">
                <h3>📜 Certifications</h3>
                <ul class="projects-list" style="margin-bottom: 0;">
                    ${candidate.certifications.map(cert => `<li>${cert}</li>`).join('')}
                </ul>
            </div>
            <div class="profile-section">
                <h3>💰 Expected Salary</h3>
                <p style="font-size: 24px; color: #0a66c2; font-weight: bold; margin-bottom: 10px;">${candidate.expectedSalary}</p>
                <h3>🎓 Education</h3>
                <p>${candidate.education}</p>
            </div>
        </div>

        <div class="profile-section">
            <h3>📧 Contact Information</h3>
            <p><strong>Email:</strong> <a href="mailto:${candidate.email}" style="color: #0a66c2;">${candidate.email}</a></p>
            <p><strong>Phone:</strong> ${candidate.phone}</p>
            <p><strong>LinkedIn:</strong> <a href="https://${candidate.linkedin}" target="_blank" style="color: #0a66c2;">View Profile</a></p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function generateRecommendation(candidate) {
    let recommendation = `${candidate.name} is an **outstanding fit** with a score of ${candidate.score}%. `;
    
    if (candidate.scoreBreakdown.skillMatch > 35) {
        recommendation += `They possess **deep expertise** in the required stack, matching **${candidate.matchedSkills.length}** key skills including **${candidate.matchedSkills.slice(0, 3).join(', ')}**. `;
    }
    
    if (candidate.scoreBreakdown.experienceMatch >= 17) {
        recommendation += `Their **${candidate.experience} of experience** is ideal for a senior role, suggesting the maturity and autonomy needed. `;
    }
    
    if (candidate.scoreBreakdown.contextMatch > 5) {
        const context = jobContext.includes('Senior Leadership Role') ? 'a leadership role' : 'a high-growth environment';
        recommendation += `The AI confirms a **strong cultural fit**, having relevant experience in **${context}**. `;
    }
    
    recommendation += `Their project history, notably the one involving "**${candidate.projects[0].substring(0, 50)}...**", validates their ability to deliver high-impact results. **Strongly recommended for the next stage.**`;
    
    return recommendation;
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('profileModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function showLoading(text) {
    document.getElementById('loading').classList.remove('hidden');
    document.querySelector('.loading-text').textContent = text;
    document.querySelector('.loading-subtext').textContent = 'This usually takes a few seconds.';
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}