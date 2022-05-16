(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else {
        var a = factory();
        for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
    }
})(self, (function() {
    return function() {
        var __webpack_exports__ = {};
        var username = "USERNAME_TO_REPLACE";
        var password = "PASSWORD_TO_REPLACE";
        var defaultLocale = "en-US";
        var mainDiv = document.getElementById("mainContent");
        var modeSelect = document.getElementById("captureModeSelection");
        var languageSelect = document.getElementById("languageSelection");
        var typeSelect = document.getElementById("captureTypeSelection");
        var geoSelect = document.getElementById("geoModeSelection");
        var tokenInput = document.getElementById("tokenInput");
        var captureButton = document.getElementById("captureButton");
        var errorText = document.getElementById("captureError");
        var capturedImage = document.getElementById("capturedImage");
        var qualityDataTextarea = document.getElementById("qualityData");
        var spinnerDiv = document.getElementById("mainSpinner");
        var isSDKInited = false;
        window.GlobalGatewayImageCompressionOption = {
            maxSizeMB: 4,
            maxWidthOrHeight: 4096,
            useWebWorker: true
        };
        window.onAcuantSdkLoaded = function() {
            var successHelper = function successHelper() {
                isSDKInited = true;
                initDone();
                console.log("SDK initialize succeeded");
            };
            var failHelper = function failHelper() {
                initDone();
                showError([ {
                    code: -1,
                    type: "Capture SDK is not initialized"
                } ]);
                console.error("Failed to initialize SDK");
            };
            InitSDK(username, password, successHelper, failHelper);
        };
        captureButton.addEventListener("click", (function() {
            startCapture();
        }));
        window.addEventListener("beforeunload", (function() {
            return EndSDK();
        }));
        function writeText(text) {
            qualityDataTextarea.value = text;
        }
        function clearText() {
            qualityDataTextarea.value = "";
        }
        function showError(error) {
            endProcess();
            if (Array.isArray(error) && error.length > 0) {
                var _error$ = error[0], code = _error$.code, type = _error$.type;
                errorText.innerHTML = "Error: ".concat(code, " ").concat(type);
            } else {
                errorText.innerHTML = "Unable to capture";
            }
            capturedImage.removeAttribute("src");
        }
        function showImage(result) {
            var image = result.image, liveness = result.liveness, classification = result.classification, quality = result.quality;
            endProcess();
            errorText.innerHTML = "";
            capturedImage.setAttribute("src", image);
            clearText();
            var qualityText = "";
            if (quality) {
                qualityText += "Sharpness: ".concat(quality.sharpness, "\nDPI: ").concat(quality.dpi, "\nGlare: ").concat(quality.glare, "\n");
            }
            if (classification) {
                qualityText += "IDClassification: ".concat(JSON.stringify(classification), "\n");
            }
            if (liveness) {
                qualityText += "LivenessResult: ".concat(JSON.stringify(liveness.LivenessResult), "\n") + "ErrorCode: ".concat(liveness.ErrorCode, "\n") + "ErrorMessage: ".concat(liveness.ErrorMessage);
            }
            writeText(qualityText);
        }
        function getIsAutoDropDown() {
            return modeSelect.options[modeSelect.selectedIndex].value === "Auto";
        }
        function startCapture() {
            if (!isSDKInited) {
                showError([ {
                    code: -1,
                    type: "Capture SDK is not initialized"
                } ]);
                return;
            }
            var shouldCollectGeo = geoSelect.options[geoSelect.selectedIndex].value === "true";
            var selectedType = typeSelect.options[typeSelect.selectedIndex].value;
            var token = tokenInput.value;
            var locale = languageSelect.options[languageSelect.selectedIndex].value;
            if (selectedType === "DocumentFront") {
                startDocumentFrontCapture(shouldCollectGeo, token, locale);
            } else if (selectedType === "DocumentBack") {
                startDocumentBackCapture(shouldCollectGeo, token, locale);
            } else if (selectedType === "LivePhoto") {
                startSelfie(shouldCollectGeo, token, locale);
            } else if (selectedType === "Passport") {
                startPassport(shouldCollectGeo, token, locale);
            }
        }
        function startDocumentFrontCapture(shouldCollectGeo, token, locale) {
            StartAcuantFrontDocumentCapture(getIsAutoDropDown(), shouldCollectGeo, startProcess, showImage, showError, token, locale, defaultLocale);
        }
        function startDocumentBackCapture(shouldCollectGeo, token, locale) {
            StartAcuantBackDocumentCapture(getIsAutoDropDown(), shouldCollectGeo, startProcess, showImage, showError, token, locale, defaultLocale);
        }
        function startPassport(shouldCollectGeo, token, locale) {
            StartAcuantPassportCapture(getIsAutoDropDown(), shouldCollectGeo, startProcess, showImage, showError, token, locale, defaultLocale);
        }
        function startSelfie(shouldCollectGeo, token, locale) {
            StartAcuantSelfieCapture(getIsAutoDropDown(), shouldCollectGeo, startProcess, showImage, showError, token, locale, defaultLocale);
        }
        function initDone() {
            hideSpinner();
            mainDiv.style.display = "block";
        }
        function startSpinner() {
            spinnerDiv.style.display = "block";
        }
        function hideSpinner() {
            spinnerDiv.style.display = "none";
        }
        function startProcess() {
            captureButton.setAttribute("disabled", "true");
            startSpinner();
        }
        function endProcess() {
            captureButton.removeAttribute("disabled");
            hideSpinner();
        }
        return __webpack_exports__;
    }();
}));