bindUI() {
  console.log('bindUI called');

  const buttons = document.querySelectorAll('[data-action]');
  console.log('Buttons found:', buttons.length);

  buttons.forEach(btn => {
    console.log('Binding:', btn.dataset.action);

    btn.addEventListener('click', () => {
      console.log('CLICK:', btn.dataset.action);

      if (typeof this.handleAction === 'function') {
        this.handleAction(btn.dataset.action);
      } else {
        console.error('handleAction not defined');
      }
    });
  });
}
