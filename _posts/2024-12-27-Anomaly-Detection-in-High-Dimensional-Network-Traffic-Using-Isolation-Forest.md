---
categories:
  - Data Science
tags:
  - Isolation Forest Algorithm
  - Pandas
  - Anomaly Detection
  - Data Analytics
  - Scikitlearn
---

In today's digital landscape, network security is a critical concern for organizations and individuals. Cyberattacks are becoming increasingly sophisticated, making it essential to detect and mitigate potential threats in real time. Traditional intrusion detection systems (IDS) often struggle with high false-positive rates or fail to adapt to evolving attack patterns (Cisco, 2023).

<br>

The challenge lies in accurately classifying network traffic as either normal or malicious. Misclassifications can result in false positives, leading to alert fatigue among security analysts, or false negatives, which can have severe consequences, including unauthorized access, data breaches, or system downtime (Kumar & Singh, 2022). This project aims to leverage data mining techniques to develop a model that effectively classifies network traffic, improving the reliability and efficiency of intrusion detection systems. Data mining approaches have been shown to enhance IDS performance by reducing false positives and increasing detection rates (Li et al., 2021).
The dataset used in this project is the UNSW-NB15 dataset from Kaggle(Moustafa & Slay, 2015). It was created by the IXIA PerfectStorm tool in the Cyber Range Lab of the Australian Centre for Cyber Security (ACCS) to generate a hybrid of real modern normal activities and synthetic contemporary attack behaviors. The dataset includes features such as packet size, protocol type, and flow duration, along with labels for attack types and normal traffic (Zhao et al., 2023).

<br>

By utilizing this comprehensive dataset and applying advanced data mining techniques, the project seeks to develop an intrusion detection model that not only reduces false positives but also adapts to the evolving nature of cyber threats, thereby enhancing overall network security.

```python

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

test_data = pd.read_csv('/content/UNSW_NB15_testing-set.csv')
train_data = pd.read_csv('/content/UNSW_NB15_training-set.csv')

```

# Data cleaning & Preprocessing

### Step 1: Handle Missing Values

We start by checking for missing values in both train_data and test_data. Missing values are imputed with the mean for numerical features and the mode for categorical features.

```python

# Impute missing numerical values in both train_data and test_data with the mean
numeric_cols_train = train_data.select_dtypes(include=np.number).columns
numeric_cols_test = test_data.select_dtypes(include=np.number).columns

train_data[numeric_cols_train] = train_data[numeric_cols_train].fillna(train_data[numeric_cols_train].mean())
test_data[numeric_cols_test] = test_data[numeric_cols_test].fillna(test_data[numeric_cols_test].mean())

# Impute missing categorical values with the mode (most frequent value)
categorical_cols_train = train_data.select_dtypes(exclude=np.number).columns
categorical_cols_test = test_data.select_dtypes(exclude=np.number).columns

train_data[categorical_cols_train] = train_data[categorical_cols_train].fillna(train_data[categorical_cols_train].mode().iloc[0])
test_data[categorical_cols_test] = test_data[categorical_cols_test].fillna(test_data[categorical_cols_test].mode().iloc[0])

```

### Step 2: Remove Duplicates

To avoid skewed results, we remove duplicate rows from both the train_data and test_data.

```python

train_data.drop_duplicates(inplace=True)
test_data.drop_duplicates(inplace=True)

```

### Step 3: Encoding Categorical Features

Both train_data and test_data contain categorical variables like proto, service, and state. These categorical variables need to be encoded using one-hot encoding, which will convert them into binary features.

```python

train_data = pd.get_dummies(train_data, columns=['proto', 'service', 'state'], drop_first=True)
test_data = pd.get_dummies(test_data, columns=['proto', 'service', 'state'], drop_first=True)

```

### Step 4: Feature Scaling

For numerical features, we apply standard scaling to both the training and test datasets. Standardization ensures that the features have a mean of 0 and a standard deviation of 1, which improves the performance of many machine learning models.

```python

from sklearn.preprocessing import StandardScaler

# Select numerical columns for scaling
numerical_cols = train_data.select_dtypes(include=['float64', 'int64']).columns

# Initialize the StandardScaler
scaler = StandardScaler()

# Apply scaling to both train_data and test_data
train_data[numerical_cols] = scaler.fit_transform(train_data[numerical_cols])
test_data[numerical_cols] = scaler.transform(test_data[numerical_cols])

```

### Step 5: Split Features and Labels

Now that the data is preprocessed, we split both train_data and test_data into features (X) and target labels (y). The label column is the target variable.

```python

# Split train_data into features (X_train) and target (y_train)
X_train = train_data.drop(columns=['label'])
y_train = train_data['label']

# Split test_data into features (X_test) and target (y_test)
X_test = test_data.drop(columns=['label'])
y_test = test_data['label']


```

# Model Training Phase : To Be Continued
