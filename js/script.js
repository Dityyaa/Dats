$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === '1';
  
    let mahasiswaList = JSON.parse(localStorage.getItem('mahasiswaList')) || [];
    let editMode = false;
    let editIndex = null;
  
    if (isAdmin) $('#formMahasiswa').removeClass('hidden');
    tampilkanMahasiswa();
  
    // ➕ Tambah / Edit Mahasiswa
    $('#formMahasiswa').on('submit', function(e) {
      e.preventDefault();
      const nama = $('#nama').val().trim();
      const nim = $('#nim').val().trim();
      const prodi = $('#prodi').val().trim();
      const semester = $('#semester').val().trim();
      const fileFoto = $('#fileFoto')[0].files[0];
  
      if (!nama || !nim || !prodi || !semester) {
        alert('Semua data wajib diisi!');
        return;
      }
  
      let fotoURL = null;
  
      if (editMode) {
        const mhs = mahasiswaList[editIndex];
        mhs.nama = nama;
        mhs.nim = nim;
        mhs.prodi = prodi;
        mhs.semester = semester;
  
        if (fileFoto) {
          if (!fileFoto.type.startsWith('image/')) {
            alert('File foto tidak valid!');
            return;
          }
          mhs.foto = URL.createObjectURL(fileFoto);
        }
  
        mahasiswaList[editIndex] = mhs;
        editMode = false;
        $('#btnCancelEdit').addClass('hidden');
        $('#formMahasiswa button[type="submit"]').text('Simpan Mahasiswa');
      } else {
        if (!fileFoto || !fileFoto.type.startsWith('image/')) {
          alert('Harap pilih foto mahasiswa!');
          return;
        }
        fotoURL = URL.createObjectURL(fileFoto);
        mahasiswaList.push({ nama, nim, prodi, semester, foto: fotoURL });
      }
  
      localStorage.setItem('mahasiswaList', JSON.stringify(mahasiswaList));
      tampilkanMahasiswa();
      this.reset();
    });
  
    // 🚫 Batal Edit
    $('#btnCancelEdit').on('click', function() {
      editMode = false;
      $('#formMahasiswa')[0].reset();
      $('#btnCancelEdit').addClass('hidden');
      $('#formMahasiswa button[type="submit"]').text('Simpan Mahasiswa');
    });
  
    // 🎓 Tampilkan Semua Mahasiswa
    function tampilkanMahasiswa() {
      const grid = $('#gridMahasiswa');
      grid.empty();
  
      if (mahasiswaList.length === 0) {
        grid.append(`<p class="col-span-full text-center text-purple-400">Belum ada data mahasiswa 🧾</p>`);
        return;
      }
  
      mahasiswaList.forEach((mhs, index) => {
        const card = `
          <div class="mahasiswaCard bg-black border border-purple-700 rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-lg transition transform cursor-pointer">
            <img src="${mhs.foto}" alt="foto" class="w-full h-48 object-cover">
            <div class="p-3">
              <h3 class="font-semibold text-lg text-purple-300">${mhs.nama}</h3>
              <p class="text-sm text-purple-400">NIM: ${mhs.nim}</p>
              <p class="text-sm text-purple-400">Prodi: ${mhs.prodi}</p>
              <p class="text-sm text-purple-400 mb-2">Semester: ${mhs.semester}</p>
              ${isAdmin ? `
                <div class="flex justify-between">
                  <button class="edit bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition" data-index="${index}">Edit</button>
                  <button class="hapus bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition" data-index="${index}">Hapus</button>
                </div>` : ''}
            </div>
          </div>
        `;
        grid.append(card);
      });
    }
  
    // 🗑️ Hapus Mahasiswa
    $(document).on('click', '.hapus', function() {
      if (!isAdmin) return;
      const index = $(this).data('index');
      if (confirm('Yakin ingin menghapus data mahasiswa ini?')) {
        mahasiswaList.splice(index, 1);
        localStorage.setItem('mahasiswaList', JSON.stringify(mahasiswaList));
        tampilkanMahasiswa();
      }
    });
  
    // ✏️ Edit Mahasiswa
    $(document).on('click', '.edit', function() {
      if (!isAdmin) return;
      editMode = true;
      editIndex = $(this).data('index');
      const mhs = mahasiswaList[editIndex];
  
      $('#nama').val(mhs.nama);
      $('#nim').val(mhs.nim);
      $('#prodi').val(mhs.prodi);
      $('#semester').val(mhs.semester);
      $('#btnCancelEdit').removeClass('hidden');
      $('#formMahasiswa button[type="submit"]').text('Update Mahasiswa');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  