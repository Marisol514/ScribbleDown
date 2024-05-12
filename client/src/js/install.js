const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();

    // Stash the event so it can be triggered later.
    let deferredPrompt = event;

    // Update UI notify the user they can install the PWA
    butInstall.style.display = 'block';

    // When the install button is clicked
    butInstall.addEventListener('click', async () => {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // Optionally log analytics about what the user decided
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, clear it
        deferredPrompt = null;
    });

    // Hide the install button after installation is complete
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA was installed');
        // Clear the deferredPrompt after successful installation
        deferredPrompt = null;
        // Optionally hide the install button
        butInstall.style.display = 'none';
    });
});

