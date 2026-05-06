let currentPage = 1;
let studentData = {};
let quizScore = 0;
let registrationID = '';

function updateProgress() {
    const progress = document.getElementById('progress');
    progress.style.width = `${currentPage * 25}%`;
}

function nextPage(pageNum) {
    // Validation
    if (pageNum === 1) {
        if (validatePersonalInfo()) {
            savePersonalInfo();
            showPage(2);
        }
    } else if (pageNum === 2) {
        if (validateAccount()) {
            saveAccountInfo();
            showPage(3);
        }
    }
}

function prevPage(pageNum) {
    showPage(pageNum - 1);
}

function showPage(pageNum) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(`page${pageNum}`).classList.add('active');
    currentPage = pageNum;
    updateProgress();
}

function validatePersonalInfo() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;
    
    if (!fullName || !email || !course) {
        alert('Please fill all required fields');
        return false;
    }
    return true;
}

function savePersonalInfo() {
    studentData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value,
        batch: document.getElementById('batch').value
    };
}

function validateAccount() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        alert('Please fill all fields');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function saveAccountInfo() {
    studentData.username = document.getElementById('username').value;
    studentData.password = document.getElementById('password').value;
}

function submitQuiz() {
    const form = document.getElementById('quizForm');
    if (!form.checkValidity()) {
        alert('Please answer all questions');
        return;
    }
    
    // Check answers (correct answers: c, b, b)
    const answers = {
        q1: 'c',
        q2: 'b', 
        q3: 'b'
    };
    
    quizScore = 0;
    for (let q in answers) {
        if (document.querySelector(`input[name="${q}"]:checked`)?.value === answers[q]) {
            quizScore++;
        }
    }
    
    if (quizScore >= 2) {
        registrationID = 'GCF-' + Date.now().toString().slice(-6);
        showCertificate();
    } else {
        alert(`Quiz score: ${quizScore}/3. Please score at least 2/3 to continue.`);
    }
}

function showCertificate() {
    document.getElementById('certName').textContent = studentData.fullName;
    document.getElementById('certCourse').textContent = studentData.course;
    document.getElementById('certBatch').textContent = studentData.batch || 'N/A';
    document.getElementById('certID').textContent = registrationID;
    document.getElementById('certDate').textContent = new Date().toLocaleDateString();
    
    showPage(4);
}

function downloadCertificate() {
    const certContent = `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; text-align: center;">
            <h2 style="margin-bottom: 20px;">🏆 GCF Student Certificate</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Student Name:</strong> ${studentData.fullName}</p>
                <p><strong>Course:</strong> ${studentData.course}</p>
                <p><strong>Batch:</strong> ${studentData.batch || 'N/A'}</p>
                <p><strong>Registration ID:</strong> ${registrationID}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p style="font-style: italic; margin-top: 20px;">Certified by Global Coding Foundation</p>
        </div>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GCF Certificate - ${studentData.fullName}</title>
            <style>body { margin: 0; padding: 20px; background: #f0f0f0; }</style>
        </head>
        <body>${certContent}</body>
        </html>
    `);
    win.document.close();
    
    // Auto print
    setTimeout(() => {
        win.print();
    }, 500);
}

function resetForm() {
    currentPage = 1;
    studentData = {};
    document.querySelectorAll('input, select').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    showPage(1);
    updateProgress();
}

// Real-time validation
document.getElementById('username').addEventListener('input', function() {
    const username = this.value;
    const check = document.getElementById('usernameCheck');
    if (username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)) {
        check.textContent = '✓';
        check.className = 'check valid';
    } else if (username.length > 0) {
        check.textContent = '✗';
        check.className = 'check invalid';
    } else {
        check.textContent = '';
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    const check = document.getElementById('passwordCheck');
    
    if (confirmPassword === password && password.length > 0) {
        check.textContent = '✓';
        check.className = 'check valid';
    } else if (confirmPassword.length > 0) {
        check.textContent = '✗';
        check.className = 'check invalid';
    } else {
        check.textContent = '';
    }
});

// Initialize
updateProgress();