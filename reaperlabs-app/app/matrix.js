export function initMatrix() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const matrix = "REAPERLABS01アニメ行列";
  const matrixArray = matrix.split("");
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  
  const drops = [];
  for(let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#8b0000';
    ctx.font = fontSize + 'px monospace';
    
    for(let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  const interval = setInterval(draw, 35);
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  return () => clearInterval(interval);
}

export function initReaperCursor() {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'reaper-cursor';
  cursor.innerHTML = '<div class="cursor-sword"></div>';
  document.body.appendChild(cursor);
  
  let mouseX = 0;
  let mouseY = 0;
  
  // Track mouse movement
  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Add slash effect on click
  const handleClick = (e) => {
    // Sword swing animation
    const sword = cursor.querySelector('.cursor-sword');
    sword.classList.add('swinging');
    setTimeout(() => sword.classList.remove('swinging'), 300);
    
    // Create slash effect
    const slash = document.createElement('div');
    slash.className = 'slash-effect';
    slash.style.left = e.clientX - 50 + 'px';
    slash.style.top = e.clientY + 'px';
    document.body.appendChild(slash);
    
    // Create gash on screen
    const gash = document.createElement('div');
    gash.className = 'screen-gash';
    gash.style.left = e.clientX - 75 + 'px';
    gash.style.top = e.clientY + 'px';
    gash.style.transform = `rotate(${-45 + Math.random() * 20}deg)`;
    document.body.appendChild(gash);
    
    // Play sound effect (optional)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPPTgjMGHm7A7+OZURE=');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore if audio fails
    
    // Remove effects after animation
    setTimeout(() => {
      slash.remove();
      gash.remove();
    }, 1000);
  };
  
  document.addEventListener('click', handleClick);
  
  // Cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClick);
    cursor.remove();
  };
}
