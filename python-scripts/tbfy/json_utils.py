import json
import dpath.util


# ****************
# Helper functions
# ****************

def is_openopps_json(filename):
    if ("-release" in str(filename)) and (("ignore-release") not in str(filename)):
        return True
    else:
        return False


def is_opencorporates_json(filename):
    if "-supplier" in str(filename):
        return True
    else:
        return False


def read_jsonfile(input_filePath):
    try:
        f = open(input_filePath)
        lines = f.read()

        dictionary_data = json.loads(lines)
        f.close()   
        return dictionary_data
    except:
        return None


def write_jsonfile(dictionary_data, output_filePath):
    if dictionary_data:
        jfile = open(output_filePath, 'w+')
        jfile.write(json.dumps(dictionary_data, indent=4).replace(': null', ': ""'))
        jfile.close()


def get_value(json_dict, path):
    try:
        new_path = path.replace('[', '').replace(']', '')
        value = dpath.util.get(json_dict, path, separator='.')
        return value
    except KeyError:
        return None


def add_property_to_single_node(json_dict, node_path, new_prop, val):
    try:
        value = get_value(json_dict, node_path)
        new_path = node_path + '.' + new_prop
        new_path = new_path.replace('[', '').replace(']', '')
        dpath.util.new(json_dict, new_path, val, separator='.')
    except KeyError:
        return None


def add_property_to_single_node2(json_dict, node_path, new_prop, val):
    try:
        new_path = node_path + '.' + new_prop
        new_path = new_path.replace('[', '').replace(']', '')
        dpath.util.new(json_dict, new_path, val, separator='.')
    except KeyError:
        return None


def add_property_to_array_node(json_dict, array_path, new_prop, val):
    try:
        array_nodes = dpath.util.get(json_dict, array_path, separator='.')
        new_path = array_path.replace('[', '').replace(']', '')

        i = 0
        for item in array_nodes:
            item_path = new_path + '.' + str(i) + '.' + new_prop
            dpath.util.new(json_dict, item_path, val, separator='.')
            i += 1
    
    except KeyError:
        return None
