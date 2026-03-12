import pandas as pd
import xgboost as xgb
import json
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, precision_score, recall_score


def train_model():
    print("Loading dataset...")
    try:
        df = pd.read_csv("../public/data/pnr_synthetic.csv")
    except FileNotFoundError:
        print("Error: 'pnr_synthetic.csv' not found. Please run generate_pnr_synthetic.py first.")
        return

    print("Encoding categorical features...")
    class_mapping = {"SL": 0, "3A": 1, "2A": 2, "1A": 3}
    train_mapping = {"Mail": 0, "Express": 1, "Superfast": 2, "Duronto": 3, "Rajdhani": 4}
    day_mapping = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}

    df["class_type_encoded"] = df["class_type"].map(class_mapping)
    df["train_type_encoded"] = df["train_type"].map(train_mapping)
    df["day_of_week_encoded"] = df["day_of_week"].map(day_mapping)

    features = [
        "wl_position",
        "days_before_travel",
        "route_demand_score",
        "season_index",
        "class_type_encoded",
        "train_type_encoded",
        "day_of_week_encoded"
    ]

    X = df[features]
    y = df["confirmed"]

    print("Splitting dataset into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost classifier...")
    model = xgb.XGBClassifier(
        max_depth=5,
        n_estimators=200,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        eval_metric="auc",
        random_state=42
    )

    model.fit(X_train, y_train)

    print("Evaluating model performance...")
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]

    metrics = {
        "auc": float(roc_auc_score(y_test, y_pred_proba)),
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred))
    }

    importance_values = model.feature_importances_
    feature_importance = {feat: float(imp) for feat, imp in zip(features, importance_values)}
    metrics["feature_importance"] = feature_importance

    print("Saving model and metrics...")
    model_filename = "model.json"
    metrics_filename = "model_metrics.json"

    model.save_model(model_filename)

    with open(metrics_filename, "w") as f:
        json.dump(metrics, f, indent=4)

    print("\n--- Training Summary ---")
    print(f"Total records processed: {len(df)}")
    print(f"Training set size: {len(X_train)}")
    print(f"Testing set size: {len(X_test)}")
    print(f"Model saved to: {model_filename}")
    print(f"Metrics saved to: {metrics_filename}")
    print("\nModel Metrics:")
    print(f"  AUC:       {metrics['auc']:.4f}")
    print(f"  Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  Precision: {metrics['precision']:.4f}")
    print(f"  Recall:    {metrics['recall']:.4f}")
    print("\nFeature Importances:")
    for feat, imp in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feat}: {imp:.4f}")


if __name__ == "__main__":
    train_model()