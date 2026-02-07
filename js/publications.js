{
    "publications": [
        {
            "id": 1,
            "title": "PIE-ADA: Physics-Informed Ensemble with Adaptive Data Augmentation for Photometric Transient Classification",
            "authors": "<strong>D. P. Guha</strong>, F. Tabassum",
            "venue": "2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence & Networking (QPAIN 2026)",
            "status": "submitted",
            "role": "First Author",
            "abstract": "The forthcoming Large Synoptic Survey Telescope (LSST) expects to observe 10 million astronomical transient events each night, making timely classification a pressing concern. The biggest problem lies in the extreme class imbalance, in which the less frequent classes constitute less than 1% of the dataset. This work introduces a new technique called Physics-Informed Ensemble with Adaptive Data Augmentation, or PIE-ADA, which aims to address the problem of extreme class imbalance by using physically valid transformations in the generation of synthetic data. Our features consist of 271 features at different scales derived from six photometric passbands. On the PLAsTiCC dataset (7,848 original samples augmented to 8,148, 14 classes), five machine learning algorithms were tested: LightGBM, XGBoost, Random Forest, Extra Trees, and Neural Networks. Our best model, LightGBM, yields a weighted logarithmic loss of 0.5767 (±0.0089) and 80.36% accuracy using 5-fold cross-validation, representing a 24–33% improvement over baseline algorithms.",
            "contribution": null
        },
        {
            "id": 2,
            "title": "LunaXNet: A Novel Pre-Post-AI Framework for Mineralogical Segmentation, Quantification, and Interpretation from Lunar Hyperspectral Data",
            "authors": "<strong>D. P. Guha</strong>, M. A. Y. Srizon, et al.",
            "venue": "Target: IEEE Transactions on Geoscience and Remote Sensing",
            "status": "in preparation",
            "role": "First Author",
            "abstract": "We introduce LunaXNet, an end-to-end deep learning framework for automated lunar mineralogy mapping from Chandrayaan-1 Moon Mineralogy Mapper (M3) hyperspectral data. The framework integrates three key components: (1) Pre-AI preprocessing pipeline handling atmospheric correction, photometric normalization, and spectral noise reduction; (2) LunaXNet architecture—a novel hybrid CNN-Transformer model for semantic segmentation of mineral species (olivine, pyroxene, plagioclase, ilmenite, spinel) at sub-kilometer resolution; (3) Post-AI interpretation module providing quantitative mineral abundance maps, confidence metrics, and geological context. LunaXNet achieves 92%+ pixel-wise accuracy, outperforming traditional spectral unmixing and existing CNN baselines.",
            "contribution": null
        },
        {
            "id": 3,
            "title": "RGC v2.0: Hierarchical Multi-Class Classification of Radio AGN Morphologies",
            "authors": "M. S. H. Shahal, A. Khan, <strong>D. P. Guha</strong>, K. M. B. Asad, et al.",
            "venue": "Target: Astronomy & Astrophysics",
            "status": "in preparation",
            "role": "Co-author",
            "abstract": "We present RGC v2.0, an extended version of the Radha Gobinda Chandra radio galaxy classifier, featuring hierarchical multi-class classification of radio AGN morphologies. The framework processes images from LOFAR/LoTSS (144 MHz) and VLA/FIRST (1.4 GHz) surveys, implementing semi-supervised CNN architecture for classification of Fanaroff-Riley Type I (FRI), Type II (FRII), Wide-Angle Tail (WAT), Narrow-Angle Tail (NAT), Compact, and Hybrid morphologies.",
            "contribution": "Semi-supervised learning implementation, bent morphology classification (WAT/NAT), data preprocessing pipeline development, model training and validation"
        },
        {
            "id": 4,
            "title": "Vision-Language Models for Multi-Wavelength Galaxy Characterization",
            "authors": "M. S. Hossain, et al., <strong>D. P. Guha</strong>, K. M. B. Asad, et al.",
            "venue": "Target: The Astrophysical Journal Supplement Series",
            "status": "in preparation",
            "role": "Co-author",
            "abstract": "We present a multimodal AI system leveraging Vision-Language Models for automated characterization of galaxies across multiple wavelengths. The system ingests galaxy images from optical (Pan-STARRS, SDSS), infrared (WISE), radio (LOFAR, VLA), and X-ray surveys to generate comprehensive astrophysical descriptions and classifications.",
            "contribution": "Vision LLM pipeline development, multi-wavelength data integration, automated description generation system"
        },
        {
            "id": 5,
            "title": "GAN-Enhanced Gastrointestinal Disease Classification with Dual-Stage Preprocessing and Interpretable Post-Processing Framework",
            "authors": "T. Sabira, <strong>D. P. Guha</strong>, M. A. Y. Srizon, et al.",
            "venue": "Target: Medical Image Analysis (Elsevier)",
            "status": "in preparation",
            "role": "Co-author",
            "abstract": "Gastrointestinal disease diagnosis from endoscopic imagery faces challenges of class imbalance, limited training data, and interpretability requirements for clinical adoption. We propose a comprehensive pipeline integrating GAN-based data augmentation, multi-architecture ensemble (EfficientNetV2, ResNet152, Vision Transformer), and interpretable post-processing with Grad-CAM and SHAP analyses. Our framework achieves 96.2% accuracy across 8 disease classes.",
            "contribution": "GAN implementation and training, synthetic data quality assessment, ensemble model integration, Grad-CAM visualization, literature review"
        },
        {
            "id": 6,
            "title": "Physics-Inspired Multimodal Emotion Recognition for Telemedicine Triage",
            "authors": "S. Rezwana, <strong>D. P. Guha</strong>",
            "venue": "Target: 2026 IEEE QPAIN",
            "status": "in preparation",
            "role": "Co-author",
            "abstract": "We present a physics-inspired multimodal emotion recognition framework for telemedicine triage applications. Our approach introduces TAAB (Telehealth Acoustic Augmentation Bank)—a physics-inspired audio augmentation pipeline simulating realistic telehealth conditions, and a physics-aware loss function incorporating temporal and spectral smoothness constraints.",
            "contribution": "TAAB design and implementation, physics-aware loss function formulation, ablation studies, related work on physics-informed neural networks"
        }
    ]
}
