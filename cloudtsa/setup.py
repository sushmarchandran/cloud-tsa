from setuptools import setup

setup(name='cloudtsa',
      version='0.1',
      description='iter8',
      url='https://github.ibm.com/istio-research/iter8',
      author='Sushma Ravichandran',
      author_email='sushma.ravichandran@ibm.com',
      license='Unlicensed',
      install_requires=['numpy', 'Flask', 'requests', 'flask_restful', 'statsmodels', 'scipy'],
      zip_safe=False)
