import RNFS from "react-native-fs";

const saveReport = async (before: number[], after: number[]) => {
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");
  
    const path = `${RNFS.DownloadDirectoryPath}/${timestamp}.txt`;
  
    const text = `
  --- BEFORE ---
  ${JSON.stringify(before, null, 2)}
  
  --- AFTER ---
  ${JSON.stringify(after, null, 2)}
  `;
  
    try {
      await RNFS.writeFile(path, text, "utf8");
      console.log("Saved Report:", path);
    } catch (e) {
      console.log("Error saving:", e);
    }
  };
  

export default saveReport;
