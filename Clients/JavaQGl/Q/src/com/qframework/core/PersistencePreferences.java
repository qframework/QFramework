package com.qframework.core;

import java.io.FileNotFoundException; 
import java.io.IOException; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.net.MalformedURLException; 
import java.net.URL; 
import java.util.Properties; 
import java.util.prefs.AbstractPreferences; 
import java.util.prefs.BackingStoreException; 
import javax.jnlp.BasicService; 
import javax.jnlp.FileContents; 
import javax.jnlp.PersistenceService; 
import javax.jnlp.ServiceManager; 
import javax.jnlp.UnavailableServiceException; 
 
final class PersistencePreferences extends AbstractPreferences 
{ 
  private static final long MAX_SIZE = 8192L; 
  private final URL url; 
  private final PersistenceService ps; 
  private Properties properties; 
  private FileContents contents; 
  private static <T> T lookup(Class<T> type) throws
  UnavailableServiceException 
  { 
	return (T) ServiceManager.lookup(type.getName()); 
  } 
   
  PersistencePreferences() throws Exception 
  { 
	super(null, ""); 
	url = lookup(BasicService.class).getCodeBase(); 
	ps = lookup(PersistenceService.class);  
  } 

  private PersistencePreferences(PersistencePreferences parent, String name)
throws MalformedURLException 
{ 
 super(parent, name); 
 url = new URL(parent.url, name); 
 ps = parent.ps; 
 } 
 @Override 
 public boolean isUserNode() 
 {  
 return true;  
 } 
 @Override 
 protected String[] keysSpi() throws BackingStoreException 
 { 
	syncSpi(); 
	String[] array = new String[properties.size()]; 
	return properties.keySet().toArray(array); 
 } 
 
 @Override 
 protected String getSpi(String key) 
 { 
   syncWithIgnore(); 
   return properties.getProperty(key); 
  } 
  
  @Override 
  protected void removeSpi(String key) { 
  syncWithIgnore(); 
  properties.remove(key); 
  flushWithIgnore(); 
  } 
  
  @Override 
  protected void putSpi(String key, String value) { 
  syncWithIgnore(); 
  properties.setProperty(key, value); 
  flushWithIgnore(); 
  } 
  
  @Override 
  protected String[] childrenNamesSpi() throws BackingStoreException { 
  try { 
	  return ps.getNames(url); 
  } 
  catch (IOException exception) { 
  throw new BackingStoreException(exception); 
  } 
  } 
  
  @Override 
  protected AbstractPreferences childSpi(String name) { 
  try {
  return new PersistencePreferences(this, name); 
  } 
  catch (MalformedURLException exception) { 
  throw new IllegalArgumentException(name, exception); 
  } 
  } 
  
  @Override 
  protected void removeNodeSpi() throws BackingStoreException { 
  properties.clear(); 
  flushSpi(); 
  } 
  
  @Override 
  protected void flushSpi() throws BackingStoreException {
  if (properties != null) {
  try { 
  if (properties.isEmpty()) { 
  ps.delete(url); 
  contents = null; 
  } 
  else { 
  if (contents == null) { 
  ps.create(url, MAX_SIZE); 
  contents = ps.get(url); 
  } 
  storeProperties(); 
  } 
  } 
  catch (IOException exception) { 
  throw new BackingStoreException(exception); 
  } 
  } 
  } 
  
  @Override 
  protected void syncSpi() throws BackingStoreException { 
  if (properties == null) { 
  properties = new Properties(); 
  try { 
  contents = ps.get(url); 
  loadProperties(); 
  } 
  catch (FileNotFoundException exception) { 
  // expected exception 
  } 
  catch (IOException exception) { 
  throw new BackingStoreException(exception); 
  } 
  } 
  } 
  
  private void flushWithIgnore() { 
  try { 
  flushSpi(); 
  } 
  catch (BackingStoreException exception) { 
  // ignore exception by specification 
  } 
  } 
  
  private void syncWithIgnore() { 
  try {  syncSpi(); 
  } 
  catch (BackingStoreException exception) { 
  // ignore exception by specification 
  } 
  } 
 
 
  private void loadProperties() throws IOException { 
  InputStream input = contents.getInputStream(); 
  try { 
  properties.load(input); 
  } 
  finally { 
  input.close(); 
  } 
  } 
  
  private void storeProperties() throws IOException { 
  OutputStream output = contents.getOutputStream(true); 
  try { 
  properties.store(output, null); 
  } 
  finally { 
  output.close(); 
  } 
  } 
 }