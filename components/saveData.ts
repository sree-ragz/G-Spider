import { generatePDF } from 'react-native-html-to-pdf';
import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

interface PDFData {
  data5: number;
  data7: number;
  data8: number;
  data10: number;
  data11: number;
  [key: string]: number;   // allows any additional numeric fields
}
export async function createPDF(data:PDFData) {
  
  console.log("data ",data);
  const purity=data.data5;
  const count=data.data7;
  const distance=data.data8;
  const wasteIntake=data.data10;
  const totalWasteCleared=data.data11;
  
  const html = `
    <html>
      <body style="font-family: Arial; padding: 16px;">
        <h1 style="text-align:center;">Session Summary</h1>

        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ccc;">Count</td>
            <td style="padding:8px; border-bottom:1px solid #ccc;">${count}</td>
          </tr>
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ccc;">Distance</td>
            <td style="padding:8px; border-bottom:1px solid #ccc;">${distance} m</td>
          </tr>
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ccc;">Waste</td>
            <td style="padding:8px; border-bottom:1px solid #ccc;">${wasteIntake} kg</td>
          </tr>
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ccc;">Purity</td>
            <td style="padding:8px; border-bottom:1px solid #ccc;">${purity}%</td>
          </tr>
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ccc;">Total Waste Cleared</td>
            <td style="padding:8px; border-bottom:1px solid #ccc;">${totalWasteCleared} kg</td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // ---- Create filename ----
  const d = new Date();
  const filename = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;

  // ---- Ask permission on Android 10 and below ----
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );

  // ---- Generate PDF ----
  const options = {
    html,
    fileName: `Session_${filename}`,
    base64: false,
    // directory: 'Documents',
  };

  const results = await generatePDF(options);
  console.log("Generated:", results); 
  const publicDocumentsPath = `${RNFS.ExternalStorageDirectoryPath}/Documents`; 
  const targetPath = `${publicDocumentsPath}/Session_${filename}.pdf`; 
  await RNFS.moveFile(results.filePath, targetPath); 
  console.log("PDF saved at:", targetPath); 

}
