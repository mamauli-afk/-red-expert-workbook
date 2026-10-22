(function () {
  const KEY = 'avalonia-workbook-progress';
  window.Storage = {
    getProgress() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    },
    setProgress(id, done) {
      const p = this.getProgress();
      p[id] = !!done;
      localStorage.setItem(KEY, JSON.stringify(p));
    },
    getPercent(total) {
      if (!total) return 0;
      const p = this.getProgress();
      const done = Object.values(p).filter(Boolean).length;
      return Math.min(100, Math.round(done / total * 100));
    }
  };
})();