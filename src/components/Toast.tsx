export function ToastContainer() {
  return (
    <div
      id="toast-container"
      class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    ></div>
  );
}

export const toastScript = `
(function() {
  window.showToast = function(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    toast.className = \`\${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-full duration-300 pointer-events-auto\`;
    toast.innerHTML = \`<span class="text-lg">\${icon}</span><span>\${message}</span>\`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('animate-in', 'slide-in-from-right-full');
      toast.classList.add('animate-out', 'slide-out-to-right-full', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();
`;
