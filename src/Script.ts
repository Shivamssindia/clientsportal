export const closeModal = () => {
    const modal = document.getElementById('modalMask') as HTMLElement;
    if (modal) {
        modal.classList.remove('open');
    }
};
export const closeModal1 = () => {
    const modal = document.getElementById('modalConsult') as HTMLElement;
    if (modal) {
        modal.classList.remove('open');
    }
};

export const openModalClient = () => {
    const modal = document.getElementById('modalMask') as HTMLElement;
    if (modal) {
      modal.classList.add('open');
    }
  };
export const openModalConsult = () => {
    const modal = document.getElementById('modalConsult') as HTMLElement;
    if (modal) {
      modal.classList.add('open');
      switchToSignIn1();
    }
  };

export const switchToSignIn1 = () => {
    document.getElementById('tSU1')?.classList.remove('on');
    document.getElementById('tSI1')?.classList.add('on');
    document.getElementById('fSU1')?.style.setProperty('display', 'none');
    document.getElementById('fSI1')?.style.setProperty('display', 'flex');
};

export const switchToSignUp1 = () => {
    document.getElementById('tSI1')?.classList.remove('on');
    document.getElementById('tSU1')?.classList.add('on');
    document.getElementById('fSI1')?.style.setProperty('display', 'none');
    document.getElementById('fSU1')?.style.setProperty('display', 'flex');
};
export const switchToSignIn = () => {
    document.getElementById('tSU')?.classList.remove('on');
    document.getElementById('tSI')?.classList.add('on');
    document.getElementById('fSU')?.style.setProperty('display', 'none');
    document.getElementById('fSI')?.style.setProperty('display', 'flex');
};

export const switchToSignUp = () => {
    document.getElementById('tSI')?.classList.remove('on');
    document.getElementById('tSU')?.classList.add('on');
    document.getElementById('fSI')?.style.setProperty('display', 'none');
    document.getElementById('fSU')?.style.setProperty('display', 'flex');
};