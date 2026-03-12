import numpy as np
import pandas as pd


def generate_synthetic_data(num_records=50000):
    np.random.seed(42)

    wl_position = np.random.randint(1, 61, size=num_records)
    days_before_travel = np.random.randint(0, 121, size=num_records)

    classes = ["SL", "3A", "2A", "1A"]
    class_type = np.random.choice(classes, size=num_records)

    trains = ["Rajdhani", "Duronto", "Superfast", "Express", "Mail"]
    train_type = np.random.choice(trains, size=num_records)

    route_demand_score = np.random.uniform(0.0, 1.0, size=num_records)
    season_index = np.random.uniform(0.0, 1.0, size=num_records)

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    day_of_week = np.random.choice(days, size=num_records)

    conditions = [
        (wl_position >= 1) & (wl_position <= 10),
        (wl_position >= 11) & (wl_position <= 25),
        (wl_position >= 26) & (wl_position <= 45),
        (wl_position >= 46) & (wl_position <= 60)
    ]
    base_probs = [0.85, 0.55, 0.25, 0.08]
    prob = np.select(conditions, base_probs, default=0.0)

    prob += (route_demand_score - 0.5) * 0.08

    prob += (season_index - 0.5) * 0.08

    prob += (days_before_travel / 120) * 0.05

    class_adj = {"SL": 0.05, "3A": 0.03, "2A": -0.02, "1A": -0.05}
    prob += np.array([class_adj[c] for c in class_type])

    train_adj = {"Rajdhani": 0.05, "Duronto": 0.05, "Superfast": 0.0, "Express": -0.02, "Mail": -0.04}
    prob += np.array([train_adj[t] for t in train_type])

    noise = np.random.normal(0, 0.05, size=num_records)
    prob += noise

    prob = np.clip(prob, 0.0, 1.0)

    confirmed = np.random.binomial(1, prob)

    df = pd.DataFrame({
        "wl_position": wl_position,
        "days_before_travel": days_before_travel,
        "class_type": class_type,
        "train_type": train_type,
        "route_demand_score": np.round(route_demand_score, 4),
        "season_index": np.round(season_index, 4),
        "day_of_week": day_of_week,
        "confirmed": confirmed
    })

    return df


if __name__ == "__main__":
    df_synthetic = generate_synthetic_data(50000)
    output_filename = "pnr_synthetic.csv"
    df_synthetic.to_csv(output_filename, index=False)
    print(f"Successfully generated 50,000 synthetic PNR records and saved to '{output_filename}'.")