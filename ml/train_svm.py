"""Reproduce the Road Health Map SVM and save a reusable model artifact."""

from pathlib import Path

import joblib
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "Data Files" / "TotalData.csv"
OUTPUT = Path(__file__).resolve().parent / "svm_model.joblib"


def train():
    data = pd.read_csv(DATASET)
    features = data[["Acc X", "Acc Y", "Acc Z"]]
    target = data["Class"].astype(int)
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=2, stratify=target
    )
    x_resampled, y_resampled = SMOTE(random_state=2).fit_resample(x_train, y_train)
    model = SVC(kernel="rbf", C=2, gamma="scale", random_state=2)
    model.fit(x_resampled, y_resampled)
    prediction = model.predict(x_test)
    joblib.dump(model, OUTPUT)
    print(f"Rows: {len(data)}")
    print(f"Accuracy: {accuracy_score(y_test, prediction):.4f}")
    print(f"Weighted F1: {f1_score(y_test, prediction, average='weighted'):.4f}")
    print(classification_report(y_test, prediction))
    print(f"Saved model: {OUTPUT}")


if __name__ == "__main__":
    train()
