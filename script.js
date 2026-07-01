document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dataForm");
  const tableBody = document.getElementById("dataTable");
  const hapusSemuaBtn = document.getElementById("hapusSemua");
  const nimInput = document.getElementById("nim");

  let dataList = JSON.parse(localStorage.getItem("dataList")) || [];

  if (nimInput) {
    nimInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 8);
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

      const data = {
        nama,
        nim,
        layanan,
        keterangan: keterangan === "" ? "-" : keterangan
      };

      dataList.push(data);
      localStorage.setItem("dataList", JSON.stringify(dataList));

      alert("Data berhasil disimpan!");
      window.location.href = "tabel.html";
    });
  }

  function tampilkanData() {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (dataList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">Belum ada data</td>
        </tr>
      `;
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
      `;
      tableBody.appendChild(row);
    });
  }

  tampilkanData();

  if (hapusSemuaBtn) {
    hapusSemuaBtn.addEventListener("click", function () {
      if (confirm("Yakin ingin menghapus semua data?")) {
        localStorage.removeItem("dataList");
        dataList = [];
        tampilkanData();
      }
    });
  }
});