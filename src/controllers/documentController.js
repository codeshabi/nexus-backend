const Document = require('../models/Document');
const cloudinary = require('../config/cloudinary');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'nexus-documents' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const document = new Document({
      title: title || req.file.originalname,
      filename: req.file.originalname,
      fileUrl: result.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      owner: req.user.id
    });

    await document.save();
    await document.populate('owner', 'profile.firstName profile.lastName email');

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).populate('owner', 'profile.firstName profile.lastName email')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate('owner', 'profile.firstName profile.lastName email')
      .populate('signatures.user', 'profile.firstName profile.lastName email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check access
    const hasAccess = document.owner._id.toString() === req.user.id || 
                     document.sharedWith.includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const signDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if already signed
    const existingSignature = document.signatures.find(
      sig => sig.user.toString() === req.user.id
    );

    if (existingSignature) {
      return res.status(400).json({ message: 'Document already signed' });
    }

    document.signatures.push({
      user: req.user.id,
      signature
    });

    if (document.status === 'draft') {
      document.status = 'signed';
    }

    await document.save();
    await document.populate('signatures.user', 'profile.firstName profile.lastName email');

    res.json({ message: 'Document signed successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadDocument, getDocuments, getDocument, signDocument };