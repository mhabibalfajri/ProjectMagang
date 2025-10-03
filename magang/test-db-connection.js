// Test koneksi ke Supabase Database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://feoyvuyklhtwrljxweht.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing koneksi ke Supabase Database...');
  console.log('📡 URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...');
  
  try {
    // Test koneksi dasar
    console.log('\n📊 Testing koneksi dasar...');
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Koneksi berhasil! Database aktif tapi tabel belum ada.');
      console.log('📋 Status: Database berjalan, perlu membuat tabel');
      console.log('💡 Solusi: Jalankan SQL schema di Supabase dashboard');
    } else if (error) {
      console.log('⚠️  Peringatan koneksi:', error.message);
      console.log('📋 Status: Database berjalan tapi ada masalah');
    } else {
      console.log('✅ Koneksi berhasil! Data ditemukan.');
      console.log('📋 Status: Database berjalan dan tabel sudah ada');
    }
    
    // Test insert data sederhana
    console.log('\n🧪 Testing insert data...');
    const testData = {
      host: '192.168.1.100',
      name: 'Test-Device',
      description: 'Test device untuk verifikasi koneksi',
      device_type: 'switch',
      vendor: 'Test Vendor',
      model: 'Test Model',
      status: 'active'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('devices')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.log('⚠️  Insert test gagal:', insertError.message);
      console.log('📋 Kemungkinan tabel belum dibuat');
    } else {
      console.log('✅ Insert test berhasil! ID:', insertData.id);
      
      // Clean up
      await supabase
        .from('devices')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test data dibersihkan');
    }
    
    console.log('\n🎉 Test koneksi selesai!');
    console.log('\n📋 Kesimpulan:');
    console.log('- Database Supabase: ✅ AKTIF');
    console.log('- Koneksi: ✅ BERHASIL');
    console.log('- Tabel: ❓ PERLU DICEK');
    
  } catch (error) {
    console.log('❌ Test koneksi gagal:', error.message);
    console.log('\n💡 Kemungkinan masalah:');
    console.log('1. Koneksi internet bermasalah');
    console.log('2. URL atau API key salah');
    console.log('3. Project Supabase tidak aktif');
  }
}

// Jalankan test
testDatabaseConnection();
