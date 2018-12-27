//Cek compatibility browser dalam menangani websql
if (window.openDatabase) {
    //Membuat database, parameter: 1. nama database, 2.versi db, 3. deskripsi 4. ukuran database (dalam bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("biodata", "0.1", "biodata peserta workshop", 1024 * 1024);
    
    //membuat tabel person dengan SQL untuk database menggunakan function transaction
    mydb.transaction(function (t) {
    	t.executeSql("CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY ASC, nama TEXT, alamat TEXT)");
    });
    
} else {
	alert("WebSQL tidak didukung oleh browser ini!");
}

//function to menginput data ke database
function tambah_data() {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //mendapatkan nilai dari form
        var input_nama = document.getElementById("nama").value;
        var input_alamat = document.getElementById("alamat").value;
        //cek apakah nilai sudah diinput di form
        if (input_nama !== "" && input_alamat !== "") {
            //Insert data yang diisi pada form, tanda ? hanya sebagai placeholder, akan digantikan dengan data array pada parameter
            mydb.transaction(function (t) {
            	t.executeSql("INSERT INTO person (nama, alamat) VALUES (?, ?)", [input_nama, input_alamat]);
            });
        } else {
        	alert("nama dan alamat harus diisi!");
        }
    } else {
    	alert("database tidak ditemukan, browser tidak support web sql!");
    }
}

//function untuk mendapatkan data dari database
function show_data() {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //mendapatkan semua data dari database, set update_list sebagai callback function di dalam executeSql
        mydb.transaction(function (t) {
        	t.executeSql("SELECT * FROM person", [], update_list);
        });
    } else {
    	alert("database tidak ditemukan, browser tidak support web sql!");
    }
}
//function untuk menampilkan data ke tabel di index.html
function update_list(transaction, results) {
    //mendapatkan nilai dari komponen list_data
    var listholder = document.getElementById("list_data");
    //clear list di tabel
    listholder.innerHTML = "";
    var i;
    //perulangan untuk menampilkan hasil
    for (i = 0; i < results.rows.length; i++) {
        //mendapatkan data pada row ke i
        var row = results.rows.item(i);
        listholder.innerHTML +=
        `<tr>
        <td>${row.nama}</td>
        <td>${row.alamat}</td>
        <td><a href='javascript:void(0);' onclick='edit(${row.id});'>Update</a> |
        <a href='javascript:void(0);' onclick='hapus_data(${row.id});'>Hapus</a> </td>
        </tr>`;
    }
}
// pemanggilan function untuk menampilkan data dari database
show_data();

//function untuk menghapus data dari database, di dalam parameter terdapat id row dari data yang akan dihapus
function hapus_data(id) {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //menghapus data dari database berdasarkan parameter, set show_data sebagai callback function di dalam executeSql
        mydb.transaction(function (t) {
        	t.executeSql("DELETE FROM person WHERE id=?", [id], show_data);
        });
    } else {
    	alert("database tidak ditemukan, browser tidak support web sql!");
    }
}

// function ambil data dari tabel dan memasukkan ke data ke form yg akan diedit
function edit(id){
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
    	mydb.transaction(function (t) {
            //mendapatkan nilai dari komponen list_data
            var formholder = document.getElementById("form_data");
            //clear list di tabel
            formholder.innerHTML = "";
            // mengambil data berdasarkan id dan menampilkannya
            t.executeSql("SELECT * FROM person where id=?", [id], function (tx, results){
            	formholder.innerHTML =
            	`<form>
            	<h4>Update Data</h4>
            	<input type="hidden" id="id_edit" value="${id}">
            	<div class="form-group">
            	<label>Nama</label>
            	<input type="text" class="form-control" id="nama_edit" value="${results.rows.item(0).nama}">
            	</div>
            	<div class="form-group">
            	<label>Alamat</label>
            	<input type="text" class="form-control" id="alamat_edit" value="${results.rows.item(0).alamat}">
            	</div>
            	<div class="form-group">
            	<button type="submit" class="btn btn-info" onclick="update_data();">Update</button>
            	<button type="submit" class="btn btn-default" onclick="location.reload();">Batal</button>
            	</div>
            	</form>`;
            });
        });
    } else {
    	alert("database tidak ditemukan, browser tidak support web sql!");
    }
    
}
//function to mengupdate data ke database
function update_data() {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //mendapatkan nilai dari form yang akan diedit
        var edit_id = document.getElementById("id_edit").value;
        var edit_nama = document.getElementById("nama_edit").value;
        var edit_alamat = document.getElementById("alamat_edit").value;
        //cek apakah nilai sudah diinput/diedit di form
        if (edit_nama !== "" && edit_alamat !== "") {
            //update data yang diisi pada form, tanda ? hanya sebagai placeholder, akan digantikan dengan data array pada parameter
            mydb.transaction(function (t) {
            	t.executeSql("UPDATE person SET nama=?, alamat=? WHERE id=?", [edit_nama, edit_alamat, edit_id]);
            });
        } else {
        	alert("nama dan alamat harus diisi!");
        }
    } else {
    	alert("database tidak ditemukan, browser tidak support web sql!");
    }
}
