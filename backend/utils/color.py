from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000

def get_color_diff(hex1, hex2):
    # convert team1 hex to rgb
    hex1_r = int(hex1[1:3], 16)
    hex1_g = int(hex1[3:5], 16)
    hex1_b = int(hex1[5:], 16)
    color1_rgb = sRGBColor(hex1_r, hex1_g, hex1_b)

    # convert team2 hex to rgb
    hex2_r = int(hex2[1:3], 16)
    hex2_g = int(hex2[3:5], 16)
    hex2_b = int(hex2[5:], 16)
    color2_rgb = sRGBColor(hex2_r, hex2_g, hex2_b)


    # Convert from RGB to Lab Color Space
    color1_lab = convert_color(color1_rgb, LabColor)

    # Convert from RGB to Lab Color Space
    color2_lab = convert_color(color2_rgb, LabColor)

    # Find the color difference
    delta_e = delta_e_cie2000(color1_lab, color2_lab)
    
    return delta_e

def decide_color(home_primary = '', home_secondary = '', away_primary = '', away_secondary = ''):
    color_home = home_primary
    color_away = '#A2AAAD'

    # for each combination of home/away colors, check if colors are opposite
    delta_e_threshold = 49
    if get_color_diff(home_primary, away_primary) > delta_e_threshold:
        color_home = home_primary
        color_away = away_primary
    elif get_color_diff(home_primary, away_secondary) > delta_e_threshold:
        color_home = home_primary
        color_away = away_secondary
    elif get_color_diff(home_secondary, away_primary) > delta_e_threshold:
        color_home = home_secondary
        color_away = away_primary
    elif get_color_diff(home_secondary, away_secondary) > delta_e_threshold:
        color_home = home_secondary
        color_away = away_secondary

    # cannot have white rn because background of app is white
    # change to grey
    if color_away == '#FFFFFF':
        color_away = '#A2AAAD'

    # return colors as dict
    return {
        'home': color_home,
        'away': color_away
    }