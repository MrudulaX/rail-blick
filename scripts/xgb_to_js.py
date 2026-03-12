import xgboost as xgb
import json


def parse_tree_node(node, feature_map):
    if "leaf" in node:
        return {"leaf_value": node["leaf"]}

    split_feat_raw = node["split"]

    if split_feat_raw in feature_map:
        feature_index = feature_map.index(split_feat_raw)
    elif split_feat_raw.startswith("f") and split_feat_raw[1:].isdigit():
        feature_index = int(split_feat_raw[1:])
    else:
        feature_index = split_feat_raw

    left_node = None
    right_node = None

    for child in node.get("children", []):
        if child["nodeid"] == node["yes"]:
            left_node = child
        elif child["nodeid"] == node["no"]:
            right_node = child

    return {
        "split_feature": feature_index,
        "split_threshold": node["split_condition"],
        "left": parse_tree_node(left_node, feature_map),
        "right": parse_tree_node(right_node, feature_map)
    }


def convert_xgb_to_js():
    model_filename = "model.json"
    output_filename = "xgb_weights.json"

    features = [
        "wl_position",
        "days_before_travel",
        "route_demand_score",
        "season_index",
        "class_type_encoded",
        "train_type_encoded",
        "day_of_week_encoded"
    ]

    print(f"Loading XGBoost model from {model_filename}...")
    booster = xgb.Booster()
    try:
        booster.load_model(model_filename)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    trees_json_strings = booster.get_dump(dump_format="json")

    parsed_trees = []
    for tree_str in trees_json_strings:
        tree_dict = json.loads(tree_str)
        parsed_tree = parse_tree_node(tree_dict, features)
        parsed_trees.append(parsed_tree)

    base_score = float(booster.attr("base_score") or 0.5)

    js_model = {
        "n_trees": len(parsed_trees),
        "features": features,
        "trees": parsed_trees,
        "base_score": base_score
    }

    with open(output_filename, "w") as f:
        json.dump(js_model, f, indent=2)

    print(f"\n--- Conversion Summary ---")
    print(f"Number of trees: {js_model['n_trees']}")
    print(f"Number of features: {len(js_model['features'])}")


if __name__ == "__main__":
    convert_xgb_to_js()