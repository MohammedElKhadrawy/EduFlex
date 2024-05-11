import cv2
import numpy as np
import easyocr
import sys

def word_detect(img):
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    adaptive_threshold = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 85, 11)
    
    reader = easyocr.Reader(['en'], gpu=False)
    result = reader.readtext(adaptive_threshold)

    condition = False 
    Accepted_text = ""

    for text in result: 
        p1 = text[1]

        if len(p1) == 9 and p1[0].isalpha() and p1[1].isalpha() and p1[2:9].isdigit():
            Accepted_text = p1
            condition = True 
            break

    return condition, Accepted_text

def processing(img):
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_blur = cv2.GaussianBlur(img_gray, (5, 5), 1)
    img_canny = cv2.Canny(img_blur, 200, 200)

    Kernal = np.ones((5, 5))
    img_Dial = cv2.dilate(img_canny, Kernal, iterations=2)
    img_Thres = cv2.erode(img_Dial, Kernal, iterations=1)

    return img_Thres

def getContours(image):
    biggest = np.array([])
    maxArea = 0
    contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 800:
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
            if area > maxArea and len(approx) == 4:
                biggest = approx
                maxArea = area
    return biggest

def reorder(points):
    points = points.reshape((4, 2))
    new_points = np.zeros((4, 1, 2), np.int32)
    add = points.sum(1)
    new_points[0] = points[np.argmin(add)]
    new_points[3] = points[np.argmax(add)]
    diff = np.diff(points, axis=1)
    new_points[1] = points[np.argmin(diff)]
    new_points[2] = points[np.argmax(diff)]
    return new_points

def warp(image, biggest, img_size, target_width=840, target_height=530):
    width_img = img_size[0]
    height_img = img_size[1]
    biggest = reorder(biggest)
    pts1 = np.float32(biggest)
    pts2 = np.float32(([0, 0], [width_img, 0], [0, height_img], [width_img, height_img]))
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    img_output = cv2.warpPerspective(image, matrix, (width_img, height_img))
    img_cropped = img_output[20:img_output.shape[0] - 20, 20:img_output.shape[1] - 20]
    
    img_resized = cv2.resize(img_cropped, (target_width, target_height))
    
    return img_resized

# Read the image
img_path = sys.argv[1]

image = cv2.imread(img_path)

text, Accepted_text = word_detect(image)

path = 'image/'

img_size = image.shape

img_contours = image.copy()

Processing = processing(image)

biggest = getContours(Processing)

if biggest.size != 0:
    imgwarped = warp(image, biggest, img_size)
    result, condition = word_detect(image)
    if condition:
        print("valid ID card :" , Accepted_text)
        # cv2.imwrite(path + Accepted_text + ".jpg", imgwarped)
    else:
        print("Not a valid ID card")
else:
    result, condition = word_detect(image)
    if condition:
        print("valid ID card :" , Accepted_text)
        # img_resized = cv2.resize(image, (840, 530))
        # cv2.imwrite(path + Accepted_text + ".jpg", img_resized)
    else:
        print("Not a valid ID card")
