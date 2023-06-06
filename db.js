const mongoose = require("mongoose");
const Process = require("./models/Process");

const DB_URL = process.env.MONGO_URI || "mongodb://localhost:27017/BalAsha";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    /**
     * @info creating process object for individual step
     */
    const newspaperPubProcess = await Process.findOne({
      name: "NEWSPAPER_PUBLICATION",
    });
    if (!newspaperPubProcess) {
      const newspaperPub = new Process({
        name: "NEWSPAPER_PUBLICATION",
        description: "Publish photo of child in atleas 2 newspapers !",
      });
      await newspaperPub.save();
    }
    const TVPubProcess = await Process.findOne({ name: "TV_TELECASTING" });
    if (!TVPubProcess) {
      const TVPub = new Process({
        name: "TV_TELECASTING",
        description: "Telecast photo of child in a national television !",
      });
      await TVPub.save();
    }
    const policeProcess = await Process.findOne({ name: "POLICE_REPORT" });
    if (!policeProcess) {
      const policePub = new Process({
        name: "POLICE_REPORT",
        description:
          "File missing complaint, if not already done. And upload the report.",
      });
      await policePub.save();
    }
    const medicalProcess = await Process.findOne({ name: "MEDICAL_REPORT" });
    if (!medicalProcess) {
      const medicalPub = new Process({
        name: "MEDICAL_REPORT",
        description:
          "Medical report of child for age verification (if needed).",
      });
      await medicalPub.save();
    }
    const socialProcess = await Process.findOne({ name: "SOCIAL_REPORT" });
    if (!socialProcess) {
      const socialPub = new Process({
        name: "SOCIAL_REPORT",
        description: "Social investigation report of child (if needed).",
      });
      await socialPub.save();
    }
    const dcpuProcess = await Process.findOne({ name: "DCPU_REPORT" });
    if (!dcpuProcess) {
      const dcpuPub = new Process({
        name: "DCPU_REPORT",
        description:
          "Submit child's report for DCPU for NOC. Receive DCPU NOC. Upload final report from CCI.",
      });
      await dcpuPub.save();
    }
    const cwcProcess = await Process.findOne({ name: "LFA_REPORT" });
    if (!cwcProcess) {
      const cwcPub = new Process({
        name: "LFA_REPORT",
        description:
          "Submit the case to CWC for getting the legally free for adoptation (LFA) certificate. CWC will issue LFA to the CCI/SSA. Submit letter to DCPU to link the child to the relevant SAA. ",
      });
      await cwcPub.save();
    }
    const caringProcess = await Process.findOne({ name: "CARINGS_REPORT" });
    if (!caringProcess) {
      const caringsPub = new Process({
        name: "CARINGS_REPORT",
        description:
          "Submit child's file to SAA. Work with SAA and CCI to complete medical tests, MER, CSR. Follow-up with SAA to upload child into CARINGS. ",
      });
      await caringsPub.save();
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
