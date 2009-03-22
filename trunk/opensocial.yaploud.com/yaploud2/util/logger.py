import settings
import sys
import time
import inspect

def debug(msg, module_name=None):
    if settings.DEBUG:
        write('debug', msg, module_name=module_name)
        return
    
    if settings.LOG_LEVEL == 'DEBUG':
        write('debug', msg, module_name=module_name)
        return
    
def info(msg, module_name=None):
    if settings.LOG_LEVEL == 'INFO':
        write('info', msg, module_name=module_name)
        return

def write(type, msg, module_name=None):
    now = time.ctime()
    #print "------------------------------------------"
    #for i in inspect.stack():
    #    print i
    #print "------------------------------------------"
    
    if module_name is None:
        module_name = inspect.stack()[2][1] + " " + inspect.stack()[2][3]
        
    msg = '[%s] [%s] %s - %s' % (now, type, module_name, msg)
        
    sys.stderr.write(msg)
    sys.stderr.write('\n')
    sys.stderr.flush()
    
    
import logging    
    
logging.basicConfig()

def warn(msg):
    logger = logging.getLogger(__name__)
    logger.warning(msg)
    