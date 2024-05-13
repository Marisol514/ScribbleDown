const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// TODO: Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();  // Prevent the default prompt
    deferredPrompt = event;  // Save the event so it can be triggered later
    butInstall.style.display = 'block';  // Show the install button
});

// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();  // Show the install prompt
        const { outcome } = await deferredPrompt.userChoice;  // Wait for the user to respond to the prompt
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;  // Clear the deferred prompt so it can only be used once
        butInstall.style.display = 'none';  // Optionally hide the install button after prompt
      } 
});

// TODO: Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    console.log('PWA has been installed');
    // Update the UI or internal state to indicate installation
    butInstall.style.display = 'none';  // Hide the installation button 
});
