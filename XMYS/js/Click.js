

const liImgEls = document.querySelectorAll('.img-wrap');

liImgEls.forEach(liImgEl => {
    liImgEl.addEventListener('click', () => {
        document.querySelector('.current-item')?.classList.remove('current-item');
        liImgEl.classList.add('current-item');
    });
});

