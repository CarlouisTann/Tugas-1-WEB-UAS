document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dataForm");
  const tableBody = document.getElementById("dataTable");
  const hapusSemuaBtn = document.getElementById("hapusSemua");
  const nimInput = document.getElementById("nim");

  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");
  const batalEdit = document.getElementById("batalEdit");
  const editIndex = document.getElementById("editIndex");
  const editNama = document.getElementById("editNama");
  const editNim = document.getElementById("editNim");
  const editLayanan = document.getElementById("editLayanan");
  const editKeterangan = document.getElementById("editKeterangan");

  let dataList = JSON.parse(localStorage.getItem("dataList")) || [];

  const saveData = () => localStorage.setItem("dataList", JSON.stringify(dataList));
  const onlyEightDigits = (value) => value.replace(/\D/g, "").slice(0, 8);

  if (nimInput) {
    nimInput.addEventListener("input", function () {
      this.value = onlyEightDigits(this.value);
    });
  }

  if (editNim) {
    editNim.addEventListener("input", function () {
      this.value = onlyEightDigits(this.value);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = document.getElementById("nama").value.trim();
      const nim = document.getElementById("nim").value.trim();
      const layanan = document.getElementById("layanan").value;
      const keterangan = document.getElementById("keterangan").value.trim();

      if (nim.length !== 8 || !/^\d{8}$/.test(nim)) {
        alert("NIM harus terdiri dari 8 angka.");
        return;
      }

      dataList.push({
        nama,
        nim,
        layanan,
        keterangan: keterangan === "" ? "-" : keterangan
      });

      saveData();
      alert("Data berhasil disimpan!");
      window.location.href = "tabel.html";
    });
  }

  function renderTable() {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (dataList.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada data</td></tr>';
      return;
    }

    dataList.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${item.nim}</td>
        <td>${item.layanan}</td>
        <td>${item.keterangan}</td>
        <td>
          <button class="aksi-btn edit-btn" data-index="${index}">Edit</button>
          <button class="aksi-btn danger delete-btn" data-index="${index}">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditModal(Number(btn.dataset.index)));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.index);
        if (confirm("Yakin ingin menghapus data ini?")) {
          dataList.splice(idx, 1);
          saveData();
          renderTable();
        }
      });
    });
  }

  function openEditModal(index) {
    const item = dataList[index];
    editIndex.value = index;
    editNama.value = item.nama;
    editNim.value = item.nim;
    editLayanan.value = item.layanan;
    editKeterangan.value = item.keterangan === "-" ? "" : item.keterangan;
    editModal.classList.remove("hidden");
  }

  function closeEditModal() {
    editModal.classList.add("hidden");
  }

  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const idx = Number(editIndex.value);
      const nim = editNim.value.trim();

      if (nim.length !== 8 || !/^\d{8}$/.test(nim)) {
        alert("NIM harus terdiri dari 8 angka.");
        return;
      }

      dataList[idx] = {
        nama: editNama.value.trim(),
        nim,
        layanan: editLayanan.value,
        keterangan: editKeterangan.value.trim() === "" ? "-" : editKeterangan.value.trim()
      };

      saveData();
      closeEditModal();
      renderTable();
    });
  }

  if (batalEdit) {
    batalEdit.addEventListener("click", closeEditModal);
  }

  if (editModal) {
    editModal.addEventListener("click", function (e) {
      if (e.target === editModal) closeEditModal();
    });
  }

  if (hapusSemuaBtn) {
    hapusSemuaBtn.addEventListener("click", function () {
      if (confirm("Yakin ingin menghapus semua data?")) {
        dataList = [];
        saveData();
        renderTable();
      }
    });
  }

  renderTable();
});