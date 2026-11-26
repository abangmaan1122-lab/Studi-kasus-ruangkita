/**
 * ============================================================================
 * Logika Interaktif Studi Kasus & Prototipe UI RuangKita (app.js)
 * ============================================================================
 */

function formatIDR(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num || 0);
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3200);
}

const CaseStudyApp = {
  selectedType: 'Semua',
  maxPrice: 500000,
  activeBookingRoom: null,

  init() {
    this.renderRequirements();
    this.renderDatabaseDocs();
    this.renderPrototypeRooms();
    this.bindEvents();
  },

  bindEvents() {
    // Navigasi 3 Panel Utama
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-panel');
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.panel-section').forEach((sec) => sec.classList.add('hidden'));
        document.getElementById(`panel-${target}`).classList.remove('hidden');
      });
    });

    // Salin SQL Snippet
    document.getElementById('btn-copy-sql').addEventListener('click', () => {
      navigator.clipboard.writeText(SQL_SNIPPET).then(() => {
        showToast('Kode SQL berhasil disalin ke clipboard!');
      });
    });

    // Filter Prototipe UI
    document.getElementById('proto-type-filter').addEventListener('change', (e) => {
      this.selectedType = e.target.value;
      this.renderPrototypeRooms();
    });

    document.getElementById('proto-max-price').addEventListener('input', (e) => {
      this.maxPrice = Number(e.target.value);
      document.getElementById('proto-price-label').textContent = formatIDR(this.maxPrice);
      this.renderPrototypeRooms();
    });

    const resetFilters = () => {
      this.selectedType = 'Semua';
      this.maxPrice = 500000;
      document.getElementById('proto-type-filter').value = 'Semua';
      document.getElementById('proto-max-price').value = 500000;
      document.getElementById('proto-price-label').textContent = formatIDR(500000);
      this.renderPrototypeRooms();
    };

    document.getElementById('btn-reset-filter').addEventListener('click', resetFilters);
    document.getElementById('btn-empty-reset').addEventListener('click', resetFilters);

    // Modal Reservasi
    document.getElementById('btn-close-booking').addEventListener('click', () => this.closeBookingModal());
    document.getElementById('booking-days').addEventListener('input', () => this.updateBookingTotal());
    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.closeBookingModal();
      showToast(`Simulasi reservasi "${this.activeBookingRoom.name}" tercatat (Status: PENDING).`);
    });
  },

  renderRequirements() {
    document.getElementById('req-table-body').innerHTML = REQUIREMENTS_DATA.map(
      (item) => `
      <tr>
        <td><strong>${item.code}</strong></td>
        <td>${item.type}</td>
        <td>${item.desc}</td>
        <td><span class="badge-prio">${item.priority}</span></td>
      </tr>
    `
    ).join('');
  },

  renderDatabaseDocs() {
    document.getElementById('schema-tables-grid').innerHTML = SCHEMA_TABLES.map(
      (tbl) => `
      <div class="schema-card">
        <h4>${tbl.tableName}</h4>
        <ul class="field-list">
          ${tbl.fields.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `
    ).join('');

    document.getElementById('sql-code-block').textContent = SQL_SNIPPET;
  },

  renderPrototypeRooms() {
    const filtered = PROTOTYPE_ROOMS.filter((room) => {
      const matchType = this.selectedType === 'Semua' || room.type === this.selectedType;
      const matchPrice = room.price <= this.maxPrice;
      return matchType && matchPrice;
    });

    const grid = document.getElementById('proto-room-grid');
    const emptyState = document.getElementById('proto-empty-state');

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = filtered
      .map(
        (room) => `
        <article class="room-card">
          <div>
            <div class="room-top">
              <span class="room-type-tag">${room.type}</span>
              <span class="room-cap">Maks. ${room.capacity} Orang</span>
            </div>
            <h4>${room.name}</h4>
            <p>${room.facilities}</p>
          </div>
          <div class="room-footer">
            <span class="room-price">${formatIDR(room.price)} <small>/ hari</small></span>
            <button type="button" class="btn btn-primary btn-sm" onclick="CaseStudyApp.openBookingModal('${room.id}')">
              Pilih Ruang
            </button>
          </div>
        </article>
      `
      )
      .join('');
  },

  openBookingModal(roomId) {
    const room = PROTOTYPE_ROOMS.find((r) => r.id === roomId);
    if (!room) return;

    this.activeBookingRoom = room;
    document.getElementById('booking-room-title').textContent = room.name;
    document.getElementById('booking-room-price').textContent = `Tarif Dasar: ${formatIDR(room.price)} per hari`;
    document.getElementById('booking-date').value = new Date().toISOString().slice(0, 10);
    document.getElementById('booking-days').value = 1;
    this.updateBookingTotal();

    document.getElementById('booking-modal').classList.remove('hidden');
  },

  updateBookingTotal() {
    if (!this.activeBookingRoom) return;
    const days = Math.max(1, Number(document.getElementById('booking-days').value) || 1);
    document.getElementById('booking-total-preview').textContent = formatIDR(this.activeBookingRoom.price * days);
  },

  closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CaseStudyApp.init();
});