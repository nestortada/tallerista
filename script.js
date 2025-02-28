document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.videoPlayer');

  // Reproducir automáticamente el primer video al cargar la página
  if (videos.length > 0) {
    videos[0].dataset.manualPaused = "false"; // bandera para control manual
    videos[0].currentTime = 0;
    videos[0].play();
  }

  // Inicializar bandera de control manual y agregar el listener para pausar/despausar
  videos.forEach(video => {
    video.dataset.manualPaused = "false";
    video.addEventListener('click', () => {
      // Si el video está pausado, lo reproduce y se marca como no pausado manualmente
      if (video.paused) {
        video.play();
        video.dataset.manualPaused = "false";
      } else {
        video.pause();
        video.dataset.manualPaused = "true";
      }
    });
  });

  // IntersectionObserver para detectar cuándo un video entra/sale del viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Cuando un video entra en vista, se reinicia y se reproduce
        // Además, se pausarán y reiniciarán los demás videos
        videos.forEach(v => {
          if (v !== video) {
            v.pause();
            v.currentTime = 0;
            v.dataset.manualPaused = "false"; // se resetea el control manual
          }
        });
        // Solo se auto-reproduce si el usuario no lo pausó manualmente
        if (video.dataset.manualPaused !== "true") {
          video.currentTime = 0;
          video.play();
        }
      } else {
        // Al salir de la vista, se pausa, reinicia y se resetea la bandera
        video.pause();
        video.currentTime = 0;
        video.dataset.manualPaused = "false";
      }
    });
  }, { threshold: 0.7 }); // Ajusta el umbral según convenga

  videos.forEach(video => observer.observe(video));
});
